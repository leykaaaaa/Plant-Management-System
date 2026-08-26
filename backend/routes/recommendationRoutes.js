const express = require("express");
const pool = require("../config/db");

const {
    calculateCompatibility,
    generateWeatherAdvisory,
    generateForecastAdvisory
} = require("../services/recommendationEngine");

const {
    getCurrentWeather
} = require("../services/weatherService");

const {
    getWeatherForecast
} = require("../services/forecastService");

const router = express.Router();


// Pangasinan locations
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


router.post("/", async (req, res) => {

    console.log(
        "Recommendation conditions:",
        req.body
    );

    try {

        // ==========================================
        // 1. GET USER CONDITIONS
        // ==========================================

        const userConditions = {

            location: req.body.location,

            soil: req.body.soil,

            water: req.body.water,

            sunlight: req.body.sunlight,

            temperature: req.body.temperature,

            environment: req.body.environment,

            weather: null

        };


        // ==========================================
        // 2. GET LOCATION COORDINATES
        // ==========================================

        const coordinates =
            pangasinanLocations[
                userConditions.location
            ];


        if (!coordinates) {

            return res.status(400).json({

                success: false,

                message:
                    "Location is not supported yet."

            });

        }


        // ==========================================
        // 3. GET CURRENT WEATHER
        // ==========================================

        const weather =
            await getCurrentWeather(
                coordinates.latitude,
                coordinates.longitude
            );


        userConditions.weather =
            weather;


        // ==========================================
        // 4. CURRENT WEATHER ADVISORY
        // ==========================================

        const weatherAdvisory =
            generateWeatherAdvisory(
                weather
            );


        // ==========================================
        // 5. GET EXTENDED FORECAST
        // ==========================================

        const forecast =
            await getWeatherForecast(
                coordinates.latitude,
                coordinates.longitude
            );


        // ==========================================
        // 6. FORECAST ADVISORY
        // ==========================================

        const forecastAdvisory =
            generateForecastAdvisory(
                forecast
            );


        // ==========================================
        // 7. GET CROPS AND REQUIREMENTS
        // ==========================================

        const [crops] = await pool.query(`

            SELECT

                crops.crop_id,

                crops.crop_name,

                crops.description,

                crops.growing_period,

                crops.harvest_period,

                crop_requirements.soil_type,

                crop_requirements.water_requirement,

                crop_requirements.sunlight_requirement,

                crop_requirements.min_temperature,

                crop_requirements.max_temperature,

                crop_requirements.environment

            FROM crops

            INNER JOIN crop_requirements

                ON crops.crop_id =
                   crop_requirements.crop_id

        `);


        // ==========================================
        // 8. CALCULATE CROP COMPATIBILITY
        // ==========================================

        const recommendations =
            crops.map(crop => {

                const compatibility =
                    calculateCompatibility(
                        userConditions,
                        crop
                    );


                return {

                    crop_id:
                        crop.crop_id,

                    crop_name:
                        crop.crop_name,

                    description:
                        crop.description,

                    growing_period:
                        crop.growing_period,

                    harvest_period:
                        crop.harvest_period,

                    score:
                        compatibility.score,

                    result:
                        compatibility.result,

                    factors:
                        compatibility.factors

                };

            });


        // ==========================================
        // 9. SORT BY HIGHEST SCORE
        // ==========================================

        recommendations.sort(
            (a, b) =>
                b.score - a.score
        );


        // ==========================================
        // 10. SEND RESPONSE
        // ==========================================

        res.json({

            success: true,

            userConditions,

            weather,

            forecast,

            weatherAdvisory,

            forecastAdvisory,

            recommendations

        });


    } catch (error) {

        console.error(
            "Recommendation Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to generate crop recommendations."

        });

    }

});


module.exports = router;