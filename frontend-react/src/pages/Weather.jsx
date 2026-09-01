import { useEffect, useState } from "react";
import "../styles/weather.css";
import Navbar from "../components/Navbar";

const pangasinanLocations = {
    Dagupan: {
        latitude: 16.0433,
        longitude: 120.3333
    },

    Lingayen: {
        latitude: 16.0217,
        longitude: 120.2319
    },

    Urdaneta: {
        latitude: 15.9761,
        longitude: 120.5711
    },

    "Santa Barbara": {
        latitude: 16.0000,
        longitude: 120.4000
    },

    "San Carlos": {
        latitude: 15.9280,
        longitude: 120.3480
    }
};

function Weather() {

    const [location, setLocation] = useState("");
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const storedUser =
            localStorage.getItem("buildBloomUser");

        if (storedUser) {

            try {

                const user = JSON.parse(storedUser);

                if (user.location) {
                    setLocation(user.location);
                }

            } catch (error) {

                console.error(
                    "Invalid stored user:",
                    error
                );

            }

        }

    }, []);

    useEffect(() => {

        if (!location) return;

        loadWeather(location);

    }, [location]);

    async function loadWeather(selectedLocation) {

        const coordinates =
            pangasinanLocations[selectedLocation];

        if (!coordinates) {
            return;
        }

        setLoading(true);
        setError("");

        try {

            const weatherResponse =
                await fetch(
                    `http://localhost:5000/api/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}`
                );

            const weatherData =
                await weatherResponse.json();

            if (
                !weatherResponse.ok ||
                !weatherData.success
            ) {

                throw new Error(
                    weatherData.message ||
                    "Unable to retrieve weather."
                );

            }

            setWeather(
                weatherData.weather
            );

            const forecastResponse =
                await fetch(
                    `http://localhost:5000/api/weather/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}`
                );

            const forecastData =
                await forecastResponse.json();

            if (
                forecastResponse.ok &&
                forecastData.success
            ) {

                setForecast(
                    forecastData.forecast || []
                );

            }

        } catch (error) {

            console.error(
                "Weather Error:",
                error
            );

            setError(
                "Unable to retrieve weather information."
            );

            setWeather(null);
            setForecast([]);

        } finally {

            setLoading(false);

        }

    }

    function getWeatherIcon(condition) {

        switch (condition) {

            case "Clear":
                return "☀️";

            case "Clouds":
                return "☁️";

            case "Rain":
                return "🌧️";

            case "Drizzle":
                return "🌦️";

            case "Thunderstorm":
                return "⛈️";

            case "Snow":
                return "❄️";

            case "Mist":
            case "Fog":
            case "Haze":
                return "🌫️";

            default:
                return "🌤️";
        }
    }

    function getForecastIcon(condition) {

        const value =
            condition?.toLowerCase() || "";

        if (value.includes("thunderstorm")) {
            return "⛈️";
        }

        if (value.includes("rain")) {
            return "🌧️";
        }

        if (value.includes("cloud")) {
            return "☁️";
        }

        if (value.includes("clear")) {
            return "☀️";
        }

        return "🌤️";
    }

    return (
        <>
            <Navbar />

            <main className="weather-page">

                <section className="weather-heading">

                    <p className="eyebrow">
                        WEATHER
                    </p>

                    <h1>
                        Weather Conditions
                    </h1>

                    <p>
                        Check current weather and upcoming
                        conditions for your location.
                    </p>

                </section>

                <section className="weather-controls">

                    <label htmlFor="weatherLocation">
                        Location
                    </label>

                    <select
                        id="weatherLocation"
                        value={location}
                        onChange={(event) =>
                            setLocation(event.target.value)
                        }
                    >

                        <option value="">
                            Select a location
                        </option>

                        {Object.keys(
                            pangasinanLocations
                        ).map((place) => (

                            <option
                                key={place}
                                value={place}
                            >
                                {place}
                            </option>

                        ))}

                    </select>

                </section>

                {loading && (
                    <div className="weather-message">
                        Loading weather...
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        ❌ {error}
                        <br />
                        <br />
                        Please make sure the Build & Bloom
                        server is running.
                    </div>
                )}

                {weather && !loading && (

                    <section className="current-weather">

                        <div className="weather-card">

                            <div className="weather-main">

                                <div>

                                    <p className="weather-location">
                                        📍 {weather.location}
                                    </p>

                                    <div className="weather-temperature">
                                        {Math.round(
                                            weather.temperature
                                        )}°C
                                    </div>

                                    <div className="weather-condition">
                                        {weather.description}
                                    </div>

                                </div>

                                <div className="weather-icon">
                                    {getWeatherIcon(
                                        weather.weather
                                    )}
                                </div>

                            </div>

                            <div className="weather-details">

                                <div className="weather-detail">
                                    💧
                                    <span>
                                        Humidity
                                        <strong>
                                            {weather.humidity}%
                                        </strong>
                                    </span>
                                </div>

                                <div className="weather-detail">
                                    🌧️
                                    <span>
                                        Rainfall
                                        <strong>
                                            {weather.rainfall} mm
                                        </strong>
                                    </span>
                                </div>

                                <div className="weather-detail">
                                    💨
                                    <span>
                                        Wind
                                        <strong>
                                            {weather.windSpeed} m/s
                                        </strong>
                                    </span>
                                </div>

                                <div className="weather-detail">
                                    🌡️
                                    <span>
                                        Feels Like
                                        <strong>
                                            {Math.round(
                                                weather.feelsLike
                                            )}°C
                                        </strong>
                                    </span>
                                </div>

                            </div>

                        </div>

                    </section>

                )}

                {forecast.length > 0 && !loading && (

                    <section className="forecast-section">

                        <div className="section-heading">

                            <p className="eyebrow">
                                FORECAST
                            </p>

                            <h2>
                                Upcoming Weather
                            </h2>

                        </div>

                        <div className="forecast-grid">

                            {forecast.map((day, index) => {

                                const formattedDate =
                                    new Date(day.date)
                                        .toLocaleDateString(
                                            "en-PH",
                                            {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric"
                                            }
                                        );

                                return (

                                    <div
                                        className="forecast-card"
                                        key={day.date || index}
                                    >

                                        <div className="forecast-date">
                                            {formattedDate}
                                        </div>

                                        <div className="forecast-icon">
                                            {getForecastIcon(
                                                day.weather
                                            )}
                                        </div>

                                        <h3>
                                            {Math.round(
                                                day.temperature
                                            )}°C
                                        </h3>

                                        <p>
                                            {day.description}
                                        </p>

                                        <div className="forecast-details">

                                            <span>
                                                💧 {day.humidity}%
                                            </span>

                                            <span>
                                                🌧️ {day.rainfall} mm
                                            </span>

                                            <span>
                                                💨 {day.windSpeed} m/s
                                            </span>

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    </section>

                )}

            </main>
        </>
    );
}

export default Weather;