const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.WEATHER_API_KEY;
console.log("API Key loaded:", !!API_KEY);
console.log("API Key length:", API_KEY ? API_KEY.length : 0);

async function getCurrentWeather(latitude, longitude) {

    try {

        const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/weather",
            {
                params: {
                    lat: latitude,
                    lon: longitude,
                    appid: API_KEY,
                    units: "metric"
                }
            }
        );

        const data = response.data;

        return {
            location: data.name,

            temperature: data.main.temp,

            feelsLike: data.main.feels_like,

            humidity: data.main.humidity,

            pressure: data.main.pressure,

            weather: data.weather[0].main,

            description: data.weather[0].description,

            windSpeed: data.wind.speed,

            rainfall: data.rain
                ? data.rain["1h"] || 0
                : 0
        };

    } catch (error) {

        console.error(
            "Weather API Error:",
            error.response?.data || error.message
        );

        throw new Error(
            "Unable to retrieve weather information."
        );
    }
}

module.exports = {
    getCurrentWeather
};