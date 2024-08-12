import PropTypes from "prop-types";

// Fetch location data from OpenWeatherMap API.
const LocationToCoordinates = async (locationString) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${locationString}&limit=1&appid=${
        import.meta.env.VITE_OWM
      }`
    );
    const locationData = await response.json();
    if (locationData.length === 0) {
      throw new Error("No location by that name. Try again.");
    }
    return locationData[0]; // Return the first result
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

LocationToCoordinates.propTypes = {
  locationString: PropTypes.string.isRequired,
};

export default LocationToCoordinates;
