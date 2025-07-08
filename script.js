// Get references to DOM elements
const topicSelect = document.getElementById('topicSelect');
const responseDiv = document.getElementById('response');

// Add change event listener to the select
topicSelect.addEventListener('change', async () => {
  try {
    // Show loading state
    responseDiv.textContent = 'Loading...';
    
    // Get the selected topic
    const topic = topicSelect.value;

    // Prepare the prompt
    const prompt = `Give me a recent story about ${topic}.`;

    // Make API request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-search-preview',
        messages: [
          // Use the selected topic in the prompt
          { role: 'user', content: prompt }
        ],
        web_search_options: {
          // You can add options here, like country or number of results
          // For example: country: "us", max_results: 5
        }
      })
    });

    // Parse the response
    const data = await response.json();
    
    // Format and update the UI with the response
    let text = data.choices[0].message.content;

    // Replace plain URLs with clickable links
    text = text.replace(/(https?:\/\/[^\s)]+)/g, url => `<a href="${url}" target="_blank">${url}</a>`);

    const formattedText = text
      .split('\n\n')  // Split into paragraphs
      .filter(para => para.trim() !== '')  // Remove empty paragraphs
      .map(para => `<p>${para}</p>`)  // Wrap in p tags
      .join('');
    
    responseDiv.innerHTML = formattedText;

  } catch (error) {
    // Handle any errors
    responseDiv.textContent = 'Sorry, there was an error getting the update. Please try again.';
    console.error('Error:', error);
  }
});
