document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('roast-form');
    const formContainer = document.getElementById('form-container');
    const resultContainer = document.getElementById('result-container');
    const roastOutput = document.getElementById('roast-output');
    const resultHeader = resultContainer.querySelector('h2');
    
    const roastAgainButton = document.getElementById('roast-again-button');
    const copyRoastButton = document.getElementById('copy-roast-button');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Hide form, show result container
        formContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        resultContainer.classList.add('fade-in');
        
        // Reset UI for new roast
        roastOutput.textContent = '';
        roastAgainButton.classList.add('hidden');
        copyRoastButton.classList.add('hidden');
        resultHeader.textContent = 'THE AI IS COOKING...';

        // Add a blinking cursor for typing effect
        const cursor = document.createElement('span');
        cursor.className = 'blinking-cursor';
        roastOutput.appendChild(cursor);

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/roast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Server error.');
            }

            // Handle the stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                const chunk = decoder.decode(value, { stream: true });
                
                // Process Server-Sent Events data
                const lines = chunk.split('\n\n');
                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const jsonString = line.substring(5);
                        try {
                            const jsonData = JSON.parse(jsonString);
                            // Append new token before the cursor
                            roastOutput.insertBefore(document.createTextNode(jsonData.token), cursor);
                        } catch (e) {
                            console.error('Failed to parse JSON chunk:', jsonString);
                        }
                    }
                }
            }
            
            // Streaming finished
            resultHeader.textContent = 'THE AI HAS SPOKEN.';
            cursor.remove(); // Remove cursor
            roastAgainButton.classList.remove('hidden');
            copyRoastButton.classList.remove('hidden');

        } catch (error) {
            roastOutput.textContent = `Error: ${error.message}`;
            roastAgainButton.classList.remove('hidden');
            resultHeader.textContent = 'ERROR';
        }
    });

    roastAgainButton.addEventListener('click', () => {
        resultContainer.classList.add('hidden');
        formContainer.classList.remove('hidden');
        form.reset();
    });

    copyRoastButton.addEventListener('click', () => {
        const roastText = roastOutput.textContent;
        if (roastText) {
            navigator.clipboard.writeText(roastText).then(() => {
                copyRoastButton.innerText = 'Copied!';
                setTimeout(() => { copyRoastButton.innerText = 'Copy Roast'; }, 2000);
            });
        }
    });
});
