// =====================================================
// BUILD & BLOOM - APP.JS
// =====================================================


// =====================================================
// PANGASINAN LOCATIONS
// =====================================================

const pangasinanLocations = {

    "Dagupan": {
        latitude: 16.0433,
        longitude: 120.3333
    },

    "Lingayen": {
        latitude: 16.0217,
        longitude: 120.2319
    },

    "Urdaneta": {
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


// =====================================================
// DOM ELEMENTS
// =====================================================

const startBtn =
    document.getElementById("startBtn");

const recommendationSection =
    document.getElementById("recommendation");

const recommendationForm =
    document.getElementById("recommendationForm");

const result =
    document.getElementById("result");

const locationSelect =
    document.getElementById("location");

const weatherResult =
    document.getElementById("weatherResult");

let currentWeather = null;


// =====================================================
// START BUTTON
// =====================================================

startBtn.addEventListener("click", () => {

    recommendationSection.scrollIntoView({
        behavior: "smooth"
    });

});


// =====================================================
// LOCATION CHANGE → WEATHER
// =====================================================

locationSelect.addEventListener(
    "change",
    async () => {

        const selectedLocation =
            locationSelect.value;


        // No location selected

        if (!selectedLocation) {

            weatherResult.innerHTML = `

                <div class="weather-placeholder">

                    <p>
                        📍 Select a location to view
                        current weather conditions.
                    </p>

                </div>

            `;

            return;
        }


        // Get coordinates

        const coordinates =
            pangasinanLocations[selectedLocation];


        if (!coordinates) {

            console.error(
                "Location coordinates not found."
            );

            return;
        }


        // Loading state

        weatherResult.innerHTML = `

            <div class="weather-placeholder">

                <p>
                    🌦️ Loading current weather...
                </p>

            </div>

        `;


        try {

            const response = await fetch(
                `http://localhost:5000/api/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}`
            );


            const data =
                await response.json();


            if (!response.ok || !data.success) {

    throw new Error(
        data.message ||
        "Unable to retrieve weather."
    );

}

currentWeather = data.weather;

displayWeather(
    currentWeather
);


        } catch (error) {

            console.error(
                "Weather Error:",
                error
            );


            weatherResult.innerHTML = `

                <div class="error-message">

                    ❌ Unable to retrieve
                    weather information.

                    <br><br>

                    Please make sure the
                    Build & Bloom server
                    is running.

                </div>

            `;

        }

    }
);


// =====================================================
// DISPLAY WEATHER
// =====================================================

function displayWeather(weather) {

    weatherResult.innerHTML = `

        <div class="weather-card">

            <div class="weather-main">

                <div>

                    <p class="weather-location">

                        📍 ${weather.location}

                    </p>


                    <div class="weather-temperature">

                        ${Math.round(
                            weather.temperature
                        )}°C

                    </div>


                    <div class="weather-condition">

                        ${weather.description}

                    </div>

                </div>


                <div class="weather-icon">

                    ${getWeatherIcon(
                        weather.weather
                    )}

                </div>

            </div>


            <div class="weather-details">


                <div class="weather-detail">

                    💧 Humidity

                    <strong>

                        ${weather.humidity}%

                    </strong>

                </div>


                <div class="weather-detail">

                    🌧️ Rainfall

                    <strong>

                        ${weather.rainfall} mm

                    </strong>

                </div>


                <div class="weather-detail">

                    💨 Wind

                    <strong>

                        ${weather.windSpeed} m/s

                    </strong>

                </div>


                <div class="weather-detail">

                    🌡️ Feels Like

                    <strong>

                        ${Math.round(
                            weather.feelsLike
                        )}°C

                    </strong>

                </div>


            </div>

        </div>

    `;

}


// =====================================================
// WEATHER ICON
// =====================================================

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


// =====================================================
// RECOMMENDATION FORM
// =====================================================

recommendationForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        if (!currentWeather) {

    result.innerHTML = `

        <div class="error-message">

            🌦️ Please select a location first
            so we can retrieve the current
            weather conditions.

        </div>

    `;

    return;
}

const conditions = {

    location:
        document.getElementById("location").value,

    soil:
        document.getElementById("soil").value,

    water:
        document.getElementById("water").value,

    sunlight:
        document.getElementById("sunlight").value,

    environment:
        document.getElementById("environment").value,

    temperature:
        currentWeather.temperature,

    humidity:
        currentWeather.humidity,

    rainfall:
        currentWeather.rainfall,

    weather:
        currentWeather.weather

};

        
        // Loading state

        result.innerHTML = `

            <div class="loading-message">

                🌱 Analyzing your growing
                conditions...

            </div>

        `;


        try {

            const response = await fetch(
                "http://localhost:5000/api/recommendations",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            conditions
                        )
                }
            );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Recommendation failed."
                );

            }


            displayRecommendations(
                data.recommendations
            );


        } catch (error) {

            console.error(
                "Recommendation Error:",
                error
            );


            result.innerHTML = `

                <div class="error-message">

                    ❌ Unable to generate
                    recommendations.

                    <br><br>

                    Please make sure the
                    Build & Bloom server
                    is running.

                </div>

            `;

        }

    }
);


// =====================================================
// DISPLAY RECOMMENDATIONS
// =====================================================

function displayRecommendations(
    recommendations
) {

    if (
        !recommendations ||
        recommendations.length === 0
    ) {

        result.innerHTML = `

            <div class="no-results">

                <h3>
                    🌱 No suitable crops found
                </h3>

                <p>
                    Try adjusting your growing
                    conditions and try again.
                </p>

            </div>

        `;

        return;
    }


    let html = `

        <div class="results-header">

            <p class="eyebrow">
                YOUR RESULTS
            </p>

            <h2>
                🌱 Recommended Crops
            </h2>

            <p>
                Based on your current growing
                conditions.
            </p>

        </div>


        <div class="crop-results">

    `;


    recommendations.forEach(
        (crop, index) => {

            const score =
                Number(crop.score) || 0;


            let statusIcon;


            if (score >= 90) {

                statusIcon = "🟢";

            } else if (score >= 75) {

                statusIcon = "🟢";

            } else if (score >= 50) {

                statusIcon = "🟡";

            } else {

                statusIcon = "🔴";

            }


            html += `

                <div class="crop-card">

                    <div class="crop-ranking">

                        #${index + 1}

                    </div>


                    <div class="crop-info">

                        <h3>

                            ${statusIcon}

                            ${crop.crop_name}

                        </h3>


                        <p>

                            ${crop.description || ""}

                        </p>


                        <div class="compatibility">

                            <strong>

                                ${score}%

                            </strong>

                            <span>

                                ${crop.result || ""}

                            </span>

                        </div>


                        <div class="factor-list">

            `;


            if (
                crop.factors &&
                crop.factors.length > 0
            ) {

                crop.factors.forEach(
                    (factor) => {

                        const icon =
                            factor.status ===
                            "Suitable"
                                ? "✅"
                                : "❌";


                        html += `

                            <div class="factor">

                                <span>

                                    ${icon}

                                    ${factor.name}

                                </span>


                                <span>

                                    ${factor.status}

                                </span>

                            </div>

                        `;

                    }
                );

            }


            html += `

                        </div>

                    </div>

                </div>

            `;

        }
    );


    html += `

        </div>

    `;


    result.innerHTML = html;

}