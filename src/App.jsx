import { useState, useEffect } from "react";
import useApiRequests from "./components/UseApiRequests";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const App = () => {
  const [prompt, setPrompt] = useState("");
  const debouncedPrompt = useDebounce(prompt, 2000);
  const { error, weatherDescription } = useApiRequests(debouncedPrompt);

  const handleChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      setPrompt(prompt.trim());
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={handleChange}
          placeholder="Enter a location or weather query"
        />
        <button type="submit">Get Weather</button>
      </form>
      {error && <p>Error: {error}</p>}
      {weatherDescription && (
        <div>
          <h2>Weather Description</h2>
          <p>{weatherDescription}</p>
        </div>
      )}
    </div>
  );
};

export default App;
