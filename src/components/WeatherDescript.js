import PropTypes from "prop-types";

const WeatherDescript = async (prompt, weatherData) => {
  const url = "https://api.openai.com/v1/chat/completions";

  const sysMsg = `In a conversational professional tone, answer the [Question] based on the [Weather Data]. 

- Provide an opinion about what the weather feels like. 
- Provide temperature in either Celsius or Fahrenheit, whichever is more appropriate. 
- Never display the temperature in Kelvin. 
- Provide a recommendation on how to prepare and what to wear (e.g. bring an umbrella, wear a wind breaker, a warm jacket, etc.)`;

  const newPrompt = `Question: ${prompt}. Weather Data: ${JSON.stringify(
    weatherData
  )}`;

  const data = {
    model: "gpt-4-0613",
    messages: [
      { role: "system", content: sysMsg },
      { role: "user", content: newPrompt },
    ],
  };

  const params = {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_OPENAI}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    method: "POST",
  };

  try {
    const response = await fetch(url, params);
    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Unable to fetch weather description.");
  }
};

WeatherDescript.propTypes = {
  prompt: PropTypes.string.isRequired,
  weatherData: PropTypes.object.isRequired,
};

export default WeatherDescript;
