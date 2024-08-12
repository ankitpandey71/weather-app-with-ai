import PropTypes from "prop-types";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRateLimit = async (url, options) => {
  try {
    await delay(1000); // Adjust delay as needed
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status === 429) {
        // Handle rate limit error
        throw new Error("Rate limit exceeded");
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const PromptToLocation = async (prompt) => {
  const url = "https://api.openai.com/v1/chat/completions";

  const data = {
    model: "gpt-3.5-turbo", // Updated model name
    messages: [{ role: "user", content: prompt }],
    functions: [
      {
        name: "displayData",
        description: "Get the current weather in a given location.",
        parameters: {
          type: "object",
          properties: {
            country: { type: "string", description: "Country name." },
            countryCode: {
              type: "string",
              description: "Country code. Use ISO-3166",
            },
            USstate: { type: "string", description: "Full state name." },
            state: { type: "string", description: "Two-letter state code." },
            city: { type: "string", description: "City name." },
            unit: {
              type: "string",
              description: "Location unit: metric or imperial.",
            },
          },
          required: [
            "countryCode",
            "country",
            "USstate",
            "state",
            "city",
            "unit",
          ],
        },
      },
    ],
    function_call: "auto",
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
    const result = await fetchWithRateLimit(url, params);
    const promptRes = JSON.parse(
      result.choices[0].message.function_call.arguments
    );

    const locationString = () => {
      if (promptRes.countryCode === "US") {
        return `${promptRes.city}, ${promptRes.state}, ${promptRes.country}`;
      } else {
        return `${promptRes.city}, ${promptRes.country}`;
      }
    };

    const promptData = {
      locationString: locationString(),
      units: promptRes.unit,
      country: promptRes.country,
      USstate: promptRes.USstate,
    };

    return promptData;
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject(
      "Unable to identify a location from your question. Please try again."
    );
  }
};

PromptToLocation.propTypes = {
  prompt: PropTypes.string.isRequired,
};

export default PromptToLocation;
