const popup = document.getElementById("popupCard");
const openPopupBtn = document.getElementById("openPopupBtn");
const closePopupBtn = document.getElementById("closePopupBtn");

// When the user clicks the button, open the pop-up
openPopupBtn.onclick = function () {
    popup.style.display = "block";
}

// When the user clicks on <span> (x), close the pop-up
closePopupBtn.onclick = function () {
    popup.style.display = "none";
}

// When the user clicks anywhere outside of the pop-up, close it
window.onclick = function (event) {
    if (event.target === popup) {
        popup.style.display = "none";
    }
}

// Handle the generate button click
document.getElementById('generate-btn').addEventListener('click', async function () {
    const userInput = document.getElementById('user-input').value;

    if (!userInput) {
        alert("Please enter a question.");
        return;
    }

    // Display user input in the chatbox (above the bot's response)
    const chatbox = document.getElementById('chatbox');

    // User's message
    const userMessage = document.createElement('p');
    userMessage.classList.add('user-message');
    userMessage.textContent = `You: ${userInput}`;
    chatbox.appendChild(userMessage);

    // Add the loader while waiting for the bot response
    const loader = document.createElement('div');
    loader.classList.add('loader');
    chatbox.appendChild(loader);
    chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom

    // API call to Gemini
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=api_key', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: userInput,
                            },
                        ],
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        // Process and display result
        // After receiving the bot response
        const content = result.candidates[0].content.parts[0].text;

        // Remove loader
        chatbox.removeChild(loader);

        // Bot's message with HTML formatting applied
        const botMessage = document.createElement('p');
        botMessage.classList.add('bot-message');
        botMessage.innerHTML = content
            .replace(/## /g, "") // Replace markdown headers with HTML headers
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n\n/g, "<p></p>") // Replace markdown line breaks with HTML paragraphs
            .replace(/\* /g, "<li>") // Replace markdown bullet points with HTML list items
            .replace(/\n/g, ""); // Remove extra newlines

        chatbox.appendChild(botMessage);
        chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom

        chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
    } catch (error) {
        alert(`Failed to fetch response: ${error.message}`);
        console.error(error);
    }
});