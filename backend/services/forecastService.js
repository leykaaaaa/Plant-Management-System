const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.WEATHER_API_KEY;

async function getWeatherForecast(latitude, longitude) {

    try {

        const response = await axios.get(
            "https://api.openweathermap.org/data/2.5/forecast",
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

        /*
         * OpenWeather provides forecast
         * data every 3 hours.
         *
         * We will keep the forecast simple
         * by selecting one forecast per day.
         */

        const dailyForecast = [];

        const datesAdded = new Set();

        for (const item of data.list) {

            const date =
                item.dt_txt.split(" ")[0];

            if (!datesAdded.has(date)) {

                datesAdded.add(date);

                dailyForecast.push({

                    date: date,

                    temperature:
                        item.main.temp,

                    feelsLike:
                        item.main.feels_like,

                    humidity:
                        item.main.humidity,

                    weather:
                        item.weather[0].main,

                    description:
                        item.weather[0].description,

                    rainfall:
                        item.rain
                            ? item.rain["3h"] || 0
                            : 0,

                    windSpeed:
                        item.wind.speed

                });

            }

            /*
             * We only need the first
             * 5 days.
             */
            if (dailyForecast.length >= 5) {
                break;
            }

        }

        return dailyForecast;

    } catch (error) {

        console.error(
            "Forecast API Error:",
            error.response?.data ||
            error.message
        );

        throw new Error(
            "Unable to retrieve weather forecast."
        );

    }

}

module.exports = {
    getWeatherForecast
};