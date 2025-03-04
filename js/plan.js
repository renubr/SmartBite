document.getElementById('diet-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Collect Data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Show loader
    const loader = e.target.querySelector('.loader');
    loader.style.display = 'inline-block';

    // Hide the result section while loading
    document.getElementById('result-section').style.display = 'none';



    // Create the query string for the API
    const text = `Generate a personalized indian diet for a ${data.age}-year-old ${data.gender} who is ${data['activity-level']}, weighs ${data.weight} kg, and is ${data.height} ${data['height-unit']}. 
                  Include dietary preferences: ${data['diet-type']} diet. 
                  Optional considerations: allergies (${data.allergies}), health conditions (${data.conditions}), and budget (${data.budget || "not specified"}).`;


    // API call
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
                                text: text,
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

        // Process and Display Result
        const content = result.candidates[0].content.parts[0].text;
        const dietPlanContainer = document.getElementById('diet-plan-container');

        dietPlanContainer.innerHTML = content
            .replace(/## /g, "") // Replace markdown headers with HTML headers
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\n\n/g, "<p></p>") // Replace markdown line breaks with HTML paragraphs
            .replace(/\* /g, "<li>") // Replace markdown bullet points with HTML list items
            .replace(/\n/g, ""); // Remove extra newlines

        // Hide the loader
        loader.style.display = 'none';

        // Show the result section
        document.getElementById('result-section').style.display = 'block';
    } catch (error) {
        alert(`Failed to fetch diet plan: ${error.message}`);
        console.error(error);
    }
});