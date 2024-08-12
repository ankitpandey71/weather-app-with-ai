import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import LocationToCoordinates from "./LocationToCoordinates";
import WeatherData from "./WeatherData";
import PromptToLocation from "./PromptToLocation";
import WeatherDescript from "./WeatherDescript";

const useApiRequests = (prompt) => {
  const [error, setError] = useState(null);
  const [promptData, setPromptData] = useState({});
  const [locationData, setLocationData] = useState({});
  const [weatherData, setWeatherData] = useState({});
  const [weatherDescription, setWeatherDescription] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!prompt) return;

      try {
        const promptDataRes = await PromptToLocation(prompt);
        setPromptData(promptDataRes);

        const locationDataRes = await LocationToCoordinates(
          promptDataRes.locationString
        );
        setLocationData(locationDataRes);

        const weatherDataRes = await WeatherData(locationDataRes);
        setWeatherData(weatherDataRes);

        const weatherDescriptRes = await WeatherDescript(
          prompt,
          weatherDataRes
        );
        setWeatherDescription(weatherDescriptRes);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, [prompt]);

  return { error, promptData, locationData, weatherData, weatherDescription };
};

useApiRequests.propTypes = {
  prompt: PropTypes.string.isRequired,
};

export default useApiRequests;
