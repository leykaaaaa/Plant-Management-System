function calculateCompatibility(userConditions, crop) {

    let score = 0;

    const factors = [];

    /*
     * SOIL
     * Weight: 25%
     */
    const cropSoils = crop.soil_type
        .toLowerCase()
        .split(",")
        .map(soil => soil.trim());

    if (
        cropSoils.includes(
            userConditions.soil.toLowerCase().trim()
        )
    ) {

        score += 25;

        factors.push({
            name: "Soil",
            status: "Suitable",
            points: 25
        });

    } else {

        factors.push({
            name: "Soil",
            status: "Not Suitable",
            points: 0
        });

    }


    /*
     * WATER
     * Weight: 20%
     */
    const cropWater = crop.water_requirement
        .toLowerCase()
        .split(",")
        .map(water => water.trim());

    if (
        cropWater.includes(
            userConditions.water.toLowerCase().trim()
        )
    ) {

        score += 20;

        factors.push({
            name: "Water",
            status: "Suitable",
            points: 20
        });

    } else {

        factors.push({
            name: "Water",
            status: "Not Suitable",
            points: 0
        });

    }


    /*
     * SUNLIGHT
     * Weight: 15%
     */
    if (
        crop.sunlight_requirement
            .toLowerCase()
            .trim() ===
        userConditions.sunlight
            .toLowerCase()
            .trim()
    ) {

        score += 15;

        factors.push({
            name: "Sunlight",
            status: "Suitable",
            points: 15
        });

    } else {

        factors.push({
            name: "Sunlight",
            status: "Not Suitable",
            points: 0
        });

    }


    /*
     * TEMPERATURE
     * Weight: 15%
     */
    const userTemperature =
        Number(userConditions.temperature);

    const minTemperature =
        Number(crop.min_temperature);

    const maxTemperature =
        Number(crop.max_temperature);

    if (
        userTemperature >= minTemperature &&
        userTemperature <= maxTemperature
    ) {

        score += 15;

        factors.push({
            name: "Temperature",
            status: "Suitable",
            points: 15
        });

    } else {

        factors.push({
            name: "Temperature",
            status: "Not Suitable",
            points: 0
        });

    }


    /*
     * ENVIRONMENT
     * Weight: 5%
     */
    const environments = crop.environment
        .toLowerCase()
        .split(",")
        .map(environment => environment.trim());

    if (
        environments.includes(
            userConditions.environment
                .toLowerCase()
                .trim()
        )
    ) {

        score += 5;

        factors.push({
            name: "Environment",
            status: "Suitable",
            points: 5
        });

    } else {

        factors.push({
            name: "Environment",
            status: "Not Suitable",
            points: 0
        });

    }


    /*
     * WEATHER
     * Weight: 10%
     */

    const weather =
        userConditions.weather;

    if (weather) {

        let weatherScore = 10;

        let weatherStatus = "Suitable";

        const currentWeatherTemperature =
            Number(weather.temperature);

        const rainfall =
            Number(weather.rainfall);

        const weatherCondition =
            weather.weather
                ? weather.weather.toLowerCase()
                : "";


        /*
         * Check weather temperature
         *
         * We use the crop's temperature
         * requirements as reference.
         */

        if (
            currentWeatherTemperature < minTemperature ||
            currentWeatherTemperature > maxTemperature
        ) {

            weatherScore = 5;

            weatherStatus = "Monitor";

        }


        /*
         * Heavy rainfall
         */

        if (rainfall >= 10) {

            weatherScore = 0;

            weatherStatus = "Risk";

        }


        /*
         * Rain condition
         */

        if (
            weatherCondition.includes("thunderstorm")
        ) {

            weatherScore = 0;

            weatherStatus = "Risk";

        }


        if (
            weatherCondition.includes("rain") &&
            rainfall > 0 &&
            weatherScore > 0
        ) {

            weatherScore = Math.min(
                weatherScore,
                5
            );

            weatherStatus = "Monitor";

        }


        score += weatherScore;

        factors.push({
            name: "Weather",
            status: weatherStatus,
            points: weatherScore
        });

    } else {

        factors.push({
            name: "Weather",
            status: "Unavailable",
            points: 0
        });

    }


    /*
     * FINAL RESULT
     */

    let result;

    if (score >= 90) {

        result = "Highly Suitable";

    } else if (score >= 75) {

        result = "Suitable";

    } else if (score >= 50) {

        result = "Moderately Suitable";

    } else {

        result = "Not Recommended";

    }


    return {
        score,
        result,
        factors
    };
}


function generateWeatherAdvisory(weather) {



    if (!weather) {

        return {
            level: "Unavailable",
            message:
                "Weather information is currently unavailable."
        };

    }

    const temperature =
        Number(weather.temperature);

    const rainfall =
        Number(weather.rainfall);

    const condition =
        weather.weather
            ? weather.weather.toLowerCase()
            : "";


    // Thunderstorm
    if (condition.includes("thunderstorm")) {

        return {
            level: "Risk",
            message:
                "Thunderstorm conditions are detected. Monitor weather updates and protect crops where possible."
        };

    }


    // Heavy rainfall
    if (rainfall >= 10) {

        return {
            level: "Risk",
            message:
                "Heavy rainfall is detected. Monitor drainage and possible flooding risks."
        };

    }


    // Rain
    if (
        condition.includes("rain") &&
        rainfall > 0
    ) {

        return {
            level: "Monitor",
            message:
                "Rainfall is currently occurring. Monitor rainfall conditions and avoid excessive watering."
        };

    }


    // High temperature
    if (temperature >= 35) {

        return {
            level: "Monitor",
            message:
                "High temperature is detected. Ensure adequate water availability and monitor crops for heat stress."
        };

    }


    // Low temperature
    if (temperature <= 15) {

        return {
            level: "Monitor",
            message:
                "Low temperature is detected. Monitor crops for possible temperature stress."
        };

    }


    // Normal conditions
    return {
        level: "Good",
        message:
            "Current weather conditions are generally favorable. Continue monitoring weather changes."
    };

}

function generateForecastAdvisory(forecast) {

    if (!forecast || forecast.length === 0) {

        return {
            level: "Unavailable",
            message:
                "Extended weather forecast is currently unavailable."
        };

    }


    let rainyDays = 0;
    let hotDays = 0;
    let heavyRainDays = 0;


    forecast.forEach(day => {

        const temperature =
            Number(day.temperature);

        const rainfall =
            Number(day.rainfall);

        const weather =
            day.weather
                ? day.weather.toLowerCase()
                : "";


        if (
            weather.includes("rain") ||
            rainfall > 0
        ) {

            rainyDays++;

        }


        if (temperature >= 35) {

            hotDays++;

        }


        if (rainfall >= 10) {

            heavyRainDays++;

        }

    });


    /*
     * Heavy rainfall warning
     */

    if (heavyRainDays >= 2) {

        return {

            level: "Risk",

            message:
                "Heavy rainfall is expected on multiple forecast days. Monitor drainage, flooding risks, and avoid excessive irrigation."

        };

    }


    /*
     * Several rainy days
     */

    if (rainyDays >= 3) {

        return {

            level: "Monitor",

            message:
                "Rainy conditions are expected on several forecast days. Monitor soil moisture, drainage, and crop conditions."

        };

    }


    /*
     * High temperature
     */

    if (hotDays >= 2) {

        return {

            level: "Monitor",

            message:
                "High temperatures are expected on several forecast days. Ensure adequate water availability and monitor crops for heat stress."

        };

    }


    /*
     * Generally favorable
     */

    return {

        level: "Good",

        message:
            "The upcoming forecast shows generally manageable weather conditions. Continue monitoring weather changes."

    };

}

module.exports = {
    calculateCompatibility,
    generateWeatherAdvisory,
    generateForecastAdvisory
};