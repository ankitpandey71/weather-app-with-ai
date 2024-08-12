import PropTypes from "prop-types";

// Fetch weather data from OpenWeatherMap API.
const WeatherData = async (locationData) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${locationData.lat}&lon=${locationData.lon}&units=metric&appid=b6ba23051abb652d8c19227501e2cca1`
    );
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Unable to fetch weather data.");
  }
};

WeatherData.propTypes = {
  locationData: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
  }).isRequired,
};

export default WeatherData;
