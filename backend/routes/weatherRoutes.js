const express = require("express");

const {
    getCurrentWeather
} = require("../services/weatherService");

const {
    getWeatherForecast
} = require("../services/forecastService");

const router = express.Router();


router.get("/", async (req, res) => {

    try {

        const {
            lat,
            lon
        } = req.query;


        if (!lat || !lon) {

            return res.status(400).json({
                success: false,
                message:
                    "Latitude and longitude are required."
            });

        }


        const weather =
            await getCurrentWeather(
                lat,
                lon
            );


        res.json({

            success: true,

            weather

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

});

router.get("/forecast", async (req, res) => {

    try {

        const {
            lat,
            lon
        } = req.query;


        if (!lat || !lon) {

            return res.status(400).json({

                success: false,

                message:
                    "Latitude and longitude are required."

            });

        }


        const forecast =
            await getWeatherForecast(
                lat,
                lon
            );


        res.json({

            success: true,

            forecast

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Unable to retrieve weather forecast."

        });

    }

});


module.exports = router;