# DestroyMe.lol 🔥

Submit your sins. Get obliterated by a savage AI. You asked for it.

This is a simple, viral web app where users submit personal details and receive a custom, AI-generated roast.

## Features

-   **AI-Powered Roasts**: Uses OpenAI's GPT models to generate unique and savage roasts.
-   **Streaming Output**: Roasts are streamed token-by-token for a live "typing" effect.
-   **Minimalist UI**: Clean, responsive, single-page interface built with Tailwind CSS.
-   **Social Sharing**: Includes Open Graph and Twitter meta tags for rich link previews.
-   **Deploy-Ready**: Configured for easy one-click deployment to platforms like Railway or Render.

## How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/ch4ziz/destroyme.git](https://github.com/ch4ziz/destroyme.git)
    cd destroyme.lol
    ```

2.  **Create a virtual environment and activate it:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set up your environment variables:**
    -   Create a file named `.env` in the root directory.
    -   Add your OpenAI API key to it:
        ```
        OPENAI_API_KEY="sk-YourSecretKeyGoesHere"
        ```

5.  **Run the Flask app:**
    ```bash
    flask run --port 5001
    ```

6.  Open your browser and navigate to `http://127.0.0.1:5001`.

## Deployment

This app is ready to deploy on **Railway**.

1.  Create a new project on Railway and link it to your GitHub repository.
2.  In the project settings, go to the "Variables" tab.
3.  Add your `OPENAI_API_KEY` as a secret environment variable.
4.  Railway will automatically detect the `Procfile` and deploy the application. Your site will be live!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.