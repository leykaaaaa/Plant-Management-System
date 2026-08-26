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

const forecastResult =
    document.getElementById("forecastResult");

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
    data.weather
);

await loadForecast(
    coordinates
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

                Analyzing your growing
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
            data.recommendations,
            data.weatherAdvisory,
            data.forecastAdvisory
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
    recommendations,
    weatherAdvisory,
    forecastAdvisory
) {
    if (
        !recommendations ||
        recommendations.length === 0
    ) {

        result.innerHTML = `

            <div class="no-results">

                <h3>
                    No suitable crops found
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
            Recommended Crops
        </h2>

        <p>
            Based on your current growing conditions.
        </p>

    </div>
`;

// Current weather advisory
if (weatherAdvisory) {

    let icon = "🌤️";

    if (weatherAdvisory.level === "Monitor") {
        icon = "⚠️";
    }

    if (weatherAdvisory.level === "Risk") {
        icon = "🔴";
    }

    if (weatherAdvisory.level === "Good") {
        icon = "✅";
    }

    html += `

        <div class="weather-advisory">

            <h3>
                ${icon}
                Current Weather Advisory
            </h3>

            <p>
                ${weatherAdvisory.message}
            </p>

        </div>

    `;

}

// Current weather advisory
if (weatherAdvisory) {

    let icon = "🌤️";

    if (weatherAdvisory.level === "Monitor") {
        icon = "⚠️";
    }

    if (weatherAdvisory.level === "Risk") {
        icon = "🔴";
    }

    if (weatherAdvisory.level === "Good") {
        icon = "✅";
    }

    html += `

        <div class="weather-advisory">

            <h3>
                ${icon}
                Current Weather Advisory
            </h3>

            <p>
                ${weatherAdvisory.message}
            </p>

        </div>

    `;

}

// Extended forecast advisory
if (forecastAdvisory) {

    let icon = "🌦️";

    if (forecastAdvisory.level === "Monitor") {
        icon = "⚠️";
    }

    if (forecastAdvisory.level === "Risk") {
        icon = "🔴";
    }

    if (forecastAdvisory.level === "Good") {
        icon = "✅";
    }

    html += `

        <div class="forecast-advisory">

            <h3>
                ${icon}
                5-Day Weather Advisory
            </h3>

            <p>
                ${forecastAdvisory.message}
            </p>

        </div>

    `;

}


html += `

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

                        let icon;

                        if (factor.status === "Suitable") {

                            icon = "✅";

                        } else if (factor.status === "Monitor") {

                            icon = "⚠️";

                        } else if (factor.status === "Risk") {

                            icon = "🔴";

                        } else {

                            icon = "❌";

                        }


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

async function loadForecast(coordinates) {

    forecastResult.innerHTML = `
        <p>
            Loading forecast...
        </p>
    `;

    try {

        const response = await fetch(
            `http://localhost:5000/api/weather/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}`
        );

        const data =
            await response.json();

        if (!data.success) {

            throw new Error(
                data.message
            );

        }

        displayForecast(
            data.forecast
        );

    } catch (error) {

        console.error(error);

        forecastResult.innerHTML = `
            <div class="error-message">

                Unable to retrieve
                weather forecast.

            </div>
        `;

    }

}

function displayForecast(forecast) {

    if (!forecast || forecast.length === 0) {

        forecastResult.innerHTML = `
            <p>
                No forecast information available.
            </p>
        `;

        return;
    }

    let html = `
        <div class="forecast-grid">
    `;

    forecast.forEach(day => {

        let icon = "🌤️";

        const condition =
            day.weather.toLowerCase();

        if (condition.includes("thunderstorm")) {

            icon = "⛈️";

        } else if (condition.includes("rain")) {

            icon = "🌧️";

        } else if (condition.includes("cloud")) {

            icon = "☁️";

        } else if (condition.includes("clear")) {

            icon = "☀️";

        }

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

        html += `

            <div class="forecast-card">

                <div class="forecast-date">
                    ${formattedDate}
                </div>

                <div class="forecast-icon">
                    ${icon}
                </div>

                <h3>
                    ${Math.round(
                        day.temperature
                    )}°C
                </h3>

                <p>
                    ${day.description}
                </p>

                <div class="forecast-details">

                    <span>
                        ${day.humidity}%
                    </span>

                    <span>
                        ${day.rainfall} mm
                    </span>

                    <span>
                        ${day.windSpeed} m/s
                    </span>

                </div>

            </div>

        `;

    });

    html += `
        </div>
    `;

    forecastResult.innerHTML = html;
}

// ==========================================
// PLANTING CALENDAR
// ==========================================

const calendarResult =
    document.getElementById("calendarResult");


async function loadPlantingCalendar() {

    calendarResult.innerHTML = `
        <p>
            Loading planting calendar...
        </p>
    `;

    try {

        const response = await fetch(
            "http://localhost:5000/api/calendar"
        );

        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                "Unable to load planting calendar."
            );

        }


        displayPlantingCalendar(
            data.calendar
        );


    } catch (error) {

        console.error(
            "Planting Calendar Error:",
            error
        );


        calendarResult.innerHTML = `

            <div class="error-message">

                Unable to load
                planting calendar.

                <br><br>

                Please make sure the
                Build & Bloom server
                is running.

            </div>

        `;

    }

}


function displayPlantingCalendar(calendar) {

    if (!calendar || calendar.length === 0) {

        calendarResult.innerHTML = `

            <div class="calendar-empty">

                <div class="calendar-empty-icon">
                    ---
                </div>

                <h3>
                    Planting Calendar
                </h3>

                <p>
                    Planting schedule information
                    will appear here once the
                    agricultural data has been added.
                </p>

            </div>

        `;

        return;

    }


    let html = `

        <div class="calendar-grid">

    `;


    calendar.forEach(item => {

        html += `

            <div class="calendar-card">

                <div class="calendar-card-icon">
                    
                </div>

                <div class="calendar-card-content">

                    <h3>
                        ${item.crop_name}
                    </h3>

                    <p class="calendar-location">
                        ${item.location}
                    </p>

                    <div class="calendar-info">

                        <div>

                            <span>
                                Planting Period
                            </span>

                            <strong>
                                ${item.planting_month}
                            </strong>

                        </div>

                        <div>

                            <span>
                                Season
                            </span>

                            <strong>
                                ${item.season || "Not specified"}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        `;

    });


    html += `

        </div>

    `;


    calendarResult.innerHTML = html;

}


// Load calendar when page opens
loadPlantingCalendar();