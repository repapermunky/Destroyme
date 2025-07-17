import os
import json
from flask import Flask, request, jsonify, render_template, Response
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# --- In-memory store for leaderboard (for future use) ---
# This is a simple list to hold recent roasts.
# In a real app, you'd use a database.
# leaderboard_roasts = []

# Initialize OpenAI client
try:
    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
except Exception as e:
    print(f"Error initializing OpenAI client: {e}")
    client = None

@app.route('/')
def index():
    """Renders the main page."""
    return render_template('index.html')

@app.route('/roast', methods=['POST'])
def get_roast():
    """Receives user data and streams back a generated roast."""
    if not client:
        return Response(json.dumps({"error": "OpenAI client not configured."}), status=500, mimetype='application/json')

    try:
        data = request.json
        prompt_text = f"""
        Roast this person. Be creative, savage, and relentlessly funny. The roast should be a single, witty paragraph. Do not use slurs or overly hateful language, but make it sting. Keep it concise.

        Details:
        - Name: {data.get("name", "N/A")}
        - Age: {data.get("age", "N/A")}
        - Occupation: {data.get("occupation", "N/A")}
        - Proudest achievement: {data.get("achievement", "N/A")}
        - Biggest L: {data.get("failure", "N/A")}
        - Secretly enjoys: {data.get("pleasure", "N/A")}
        """

        def generate_stream():
            """Generator function to stream the OpenAI response."""
            stream = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a professional roaster comedian known for sharp, witty insults."},
                    {"role": "user", "content": prompt_text}
                ],
                stream=True, # This is the key change for streaming
                temperature=0.9,
                max_tokens=200,
            )
            # complete_roast = "" # Uncomment for leaderboard
            for chunk in stream:
                content = chunk.choices[0].delta.content
                if content:
                    # complete_roast += content # Uncomment for leaderboard
                    # Yield the content chunk in SSE (Server-Sent Events) format
                    yield f"data: {json.dumps({'token': content})}\n\n"
            
            # --- Optional Leaderboard Logic ---
            # if complete_roast:
            #     leaderboard_roasts.append(complete_roast)
            #     if len(leaderboard_roasts) > 5: # Keep only top 5
            #         leaderboard_roasts.pop(0)

        # Return a streaming response
        return Response(generate_stream(), mimetype='text/event-stream')

    except Exception as e:
        print(f"An error occurred: {e}")
        # Return a JSON error if something goes wrong before the stream starts
        return Response(json.dumps({"error": "Failed to start roast generation."}), status=500, mimetype='application/json')

# --- Optional Leaderboard Endpoint ---
# @app.route('/leaderboard', methods=['GET'])
# def get_leaderboard():
#     """Returns the top 5 roasts."""
#     return jsonify({"roasts": leaderboard_roasts})

if __name__ == '__main__':
    app.run(debug=True, port=5001)