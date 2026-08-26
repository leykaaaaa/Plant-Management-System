const express = require("express");
const pool = require("../config/db");

const {
    calculateCompatibility
} = require("../services/recommendationEngine");

const router = express.Router();


router.post("/", async (req, res) => {

    console.log("Recommendation conditions:", req.body);

    try {

        const userConditions = {

            location: req.body.location,

            soil: req.body.soil,

            water: req.body.water,

            sunlight: req.body.sunlight,

            temperature: req.body.temperature,

            environment: req.body.environment

        };


        /*
         * Get all crops and their requirements
         */
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


        /*
         * Calculate compatibility for every crop
         */
        const recommendations = crops.map(crop => {

            const compatibility =
                calculateCompatibility(
                    userConditions,
                    crop
                );

            return {

                crop_id: crop.crop_id,

                crop_name: crop.crop_name,

                description: crop.description,

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


        /*
         * Highest compatibility first
         */
        recommendations.sort(
            (a, b) => b.score - a.score
        );


        res.json({

            success: true,

            userConditions,

            recommendations

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                "Failed to generate crop recommendations."

        });

    }

});


module.exports = router;