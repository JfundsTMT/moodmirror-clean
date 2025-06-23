export async function fetchReflection(prompt) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });
  
    const data = await response.json();
    console.log("FULL GPT RESPONSE:", data);
  
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return {
        reflection: "Error: No valid response from GPT.",
        growthScore: null,
      };
    }
  
    return {
      reflection: data.choices[0].message.content,
      growthScore: 7, //not complete
    };
  }
  