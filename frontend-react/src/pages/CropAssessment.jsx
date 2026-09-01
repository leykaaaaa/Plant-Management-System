
import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/assessment.css";

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


function CropAssessment() {

    const [form, setForm] = useState({
        location: "",
        soil: "",
        water: "",
        sunlight: "",
        environment: ""
    });

    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [recommendations, setRecommendations] = useState([]);

    const [weatherLoading, setWeatherLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // ==========================================
    // HANDLE FORM CHANGES
    // ==========================================

    const handleChange = async (event) => {

        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        if (name === "location" && value) {
            await loadWeather(value);
        }

    };


    // ==========================================
    // LOAD WEATHER
    // ==========================================

    const loadWeather = async (location) => {

        const coordinates =
            pangasinanLocations[location];

        if (!coordinates) return;

        setWeatherLoading(true);
        setError("");

        try {

            const response = await fetch(
                `http://localhost:5000/api/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}`
            );

            const data = await response.json();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Unable to retrieve weather."
                );

            }

            setWeather(data.weather);

            await loadForecast(coordinates);

        } catch (error) {

            console.error(
                "Weather Error:",
                error
            );

            setWeather(null);

            setError(
                "Unable to retrieve weather information."
            );

        } finally {

            setWeatherLoading(false);

        }

    };


    // ==========================================
    // LOAD FORECAST
    // ==========================================

    const loadForecast = async (coordinates) => {

        try {

            const response = await fetch(
                `http://localhost:5000/api/weather/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}`
            );

            const data = await response.json();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Unable to retrieve forecast."
                );

            }

            setForecast(
                data.forecast || []
            );

        } catch (error) {

            console.error(
                "Forecast Error:",
                error
            );

            setForecast([]);

        }

    };


    // ==========================================
    // SUBMIT ASSESSMENT
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!weather) {

            setError(
                "Please select a location first so we can retrieve the current weather."
            );

            return;

        }

        setLoading(true);
        setError("");
        setRecommendations([]);


        const conditions = {

            location: form.location,

            soil: form.soil,

            water: form.water,

            sunlight: form.sunlight,

            environment: form.environment,

            temperature: weather.temperature,

            humidity: weather.humidity,

            rainfall: weather.rainfall,

            weather: weather.weather

        };


        try {

            const response = await fetch(
                "http://localhost:5000/api/recommendations",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify(
                        conditions
                    )
                }
            );


            const data =
                await response.json();


            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Recommendation failed."
                );

            }


            setRecommendations(
                data.recommendations || []
            );


            // Save latest assessment
            localStorage.setItem(
                "latestAssessment",
                JSON.stringify(conditions)
            );


        } catch (error) {

            console.error(
                "Recommendation Error:",
                error
            );

            setError(
                error.message ||
                "Unable to generate recommendations."
            );

        } finally {

            setLoading(false);

        }

    };


    // ==========================================
    // WEATHER ICON
    // ==========================================

    const getWeatherIcon = (condition) => {

        switch (condition) {

            case "Clear":
                return "☀︎";

            case "Clouds":
                return "☁︎";

            case "Rain":
                return "🌧";

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
                return "☀︎";

        }

    };


    // ==========================================
    // RENDER
    // ==========================================

    return (
        <>
            <Navbar />

            <main className="assessment-page">

                <section className="recommendation-section">

                    <div className="section-heading">

                        <p className="eyebrow">
                            CROP ASSESSMENT
                        </p>

                        <h1>
                            Find crops suited to your conditions
                        </h1>

                        <p>
                            Select your location and growing
                            conditions to receive crop
                            recommendations.
                        </p>

                    </div>


                    {/* ==================================
                        FORM
                    ================================== */}

                    <form
                        className="recommendation-form"
                        onSubmit={handleSubmit}
                    >

                        <label htmlFor="location">
                            Location
                        </label>

                        <select
                            id="location"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select a location
                            </option>

                            <option value="Dagupan">
                                Dagupan
                            </option>

                            <option value="Lingayen">
                                Lingayen
                            </option>

                            <option value="Urdaneta">
                                Urdaneta
                            </option>

                            <option value="Santa Barbara">
                                Santa Barbara
                            </option>

                            <option value="San Carlos">
                                San Carlos
                            </option>

                        </select>


                        <label htmlFor="soil">
                            Soil type
                        </label>

                        <select
                            id="soil"
                            name="soil"
                            value={form.soil}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select soil type
                            </option>

                            <option value="Loam">
                                Loam
                            </option>

                            <option value="Clay">
                                Clay
                            </option>

                            <option value="Sandy">
                                Sandy
                            </option>

                        </select>


                        <label htmlFor="water">
                            Water availability
                        </label>

                        <select
                            id="water"
                            name="water"
                            value={form.water}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select water availability
                            </option>

                            <option value="Low">
                                Low
                            </option>

                            <option value="Moderate">
                                Moderate
                            </option>

                            <option value="High">
                                High
                            </option>

                        </select>


                        <label htmlFor="sunlight">
                            Sunlight
                        </label>

                        <select
                            id="sunlight"
                            name="sunlight"
                            value={form.sunlight}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select sunlight
                            </option>

                            <option value="Low">
                                Low
                            </option>

                            <option value="Partial">
                                Partial
                            </option>

                            <option value="Full">
                                Full
                            </option>

                        </select>


                        <label htmlFor="environment">
                            Environment
                        </label>

                        <select
                            id="environment"
                            name="environment"
                            value={form.environment}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select environment
                            </option>

                            <option value="Open field">
                                Open field
                            </option>

                            <option value="Greenhouse">
                                Greenhouse
                            </option>

                            <option value="Container">
                                Container
                            </option>

                        </select>


                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={loading || weatherLoading}
                        >

                            {loading
                                ? "Analyzing..."
                                : "Get Recommendations"}

                        </button>

                    </form>


                    {/* ==================================
                        ERROR
                    ================================== */}

                    {error && (

                        <div className="error-message">
                            ❌ {error}
                        </div>

                    )}


                    {/* ==================================
                        WEATHER
                    ================================== */}

                    {weatherLoading && (

                        <div className="weather-placeholder">
                            Loading current weather...
                        </div>

                    )}


                    {weather && !weatherLoading && (

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

                                    💧 Humidity

                                    <strong>
                                        {weather.humidity}%
                                    </strong>

                                </div>


                                <div className="weather-detail">

                                    🌧️ Rainfall

                                    <strong>
                                        {weather.rainfall} mm
                                    </strong>

                                </div>


                                <div className="weather-detail">

                                    💨 Wind

                                    <strong>
                                        {weather.windSpeed} m/s
                                    </strong>

                                </div>


                                <div className="weather-detail">

                                    🌡️ Feels Like

                                    <strong>
                                        {Math.round(
                                            weather.feelsLike
                                        )}°C
                                    </strong>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* ==================================
                        FORECAST
                    ================================== */}

                    {forecast.length > 0 && (

                        <div className="forecast-section">

                            <h2>
                                5-Day Forecast
                            </h2>

                            <div className="forecast-grid">

                                {forecast.map((day, index) => {

                                    const condition =
                                        day.weather.toLowerCase();

                                    let icon = "🌤️";


                                    if (
                                        condition.includes(
                                            "thunderstorm"
                                        )
                                    ) {

                                        icon = "⛈️";

                                    } else if (
                                        condition.includes(
                                            "rain"
                                        )
                                    ) {

                                        icon = "🌧️";

                                    } else if (
                                        condition.includes(
                                            "cloud"
                                        )
                                    ) {

                                        icon = "☁️";

                                    } else if (
                                        condition.includes(
                                            "clear"
                                        )
                                    ) {

                                        icon = "☀️";

                                    }


                                    return (

                                        <div
                                            className="forecast-card"
                                            key={index}
                                        >

                                            <div className="forecast-date">

                                                {new Date(
                                                    day.date
                                                ).toLocaleDateString(
                                                    "en-PH",
                                                    {
                                                        weekday: "short",
                                                        month: "short",
                                                        day: "numeric"
                                                    }
                                                )}

                                            </div>


                                            <div className="forecast-icon">
                                                {icon}
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

                        </div>

                    )}


                    {/* ==================================
                        RECOMMENDATIONS
                    ================================== */}

                    {recommendations.length > 0 && (

                        <div className="results-section">

                            <div className="results-header">

                                <p className="eyebrow">
                                    YOUR RESULTS
                                </p>

                                <h2>
                                    Recommended Crops
                                </h2>

                                <p>
                                    Based on your current
                                    growing conditions.
                                </p>

                            </div>


                            <div className="crop-results">

                                {recommendations.map(
                                    (crop, index) => {

                                        const score =
                                            Number(crop.score) || 0;

                                        let statusIcon = "🔴";


                                        if (score >= 75) {

                                            statusIcon = "🟢";

                                        } else if (
                                            score >= 50
                                        ) {

                                            statusIcon = "🟡";

                                        }


                                        return (

                                            <div
                                                className="crop-card"
                                                key={index}
                                            >

                                                <div className="crop-ranking">
                                                    #{index + 1}
                                                </div>


                                                <div className="crop-info">

                                                    <h3>

                                                        {statusIcon}{" "}
                                                        {crop.crop_name}

                                                    </h3>


                                                    <p>
                                                        {crop.description || ""}
                                                    </p>


                                                    <div className="compatibility">

                                                        <strong>
                                                            {score}%
                                                        </strong>

                                                        <span>
                                                            {crop.result || ""}
                                                        </span>

                                                    </div>


                                                    {crop.factors &&
                                                        crop.factors.length > 0 && (

                                                            <div className="factor-list">

                                                                {crop.factors.map(
                                                                    (
                                                                        factor,
                                                                        factorIndex
                                                                    ) => {

                                                                        let icon =
                                                                            "❌";


                                                                        if (
                                                                            factor.status ===
                                                                            "Suitable"
                                                                        ) {

                                                                            icon =
                                                                                "✅";

                                                                        } else if (
                                                                            factor.status ===
                                                                            "Monitor"
                                                                        ) {

                                                                            icon =
                                                                                "⚠️";

                                                                        } else if (
                                                                            factor.status ===
                                                                            "Risk"
                                                                        ) {

                                                                            icon =
                                                                                "🔴";

                                                                        }


                                                                        return (

                                                                            <div
                                                                                className="factor"
                                                                                key={
                                                                                    factorIndex
                                                                                }
                                                                            >

                                                                                <span>

                                                                                    {icon}{" "}
                                                                                    {
                                                                                        factor.name
                                                                                    }

                                                                                </span>

                                                                                <span>
                                                                                    {
                                                                                        factor.status
                                                                                    }
                                                                                </span>

                                                                            </div>

                                                                        );

                                                                    }
                                                                )}

                                                            </div>

                                                        )}

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        </div>

                    )}

                </section>

            </main>
        </>
    );

}

export default CropAssessment;

