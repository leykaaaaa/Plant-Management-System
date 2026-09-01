
const express = require("express");
const pool = require("../config/db");

const router = express.Router();


// ==========================================
// GET ALL CROPS
// ==========================================

router.get("/", async (req, res) => {

    try {

        const [crops] = await pool.query(
            `
            SELECT
                crop_id,
                crop_name,
                description,
                growing_period,
                harvest_period

            FROM crops

            ORDER BY crop_name
            `
        );


        res.json({

            success: true,

            crops

        });

    } catch (error) {

        console.error(
            "Get Crops Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to retrieve crops."

        });

    }

});


// ==========================================
// GET SINGLE CROP + REQUIREMENTS
// ==========================================

router.get("/:id", async (req, res) => {

    const cropId = req.params.id;


    try {

        // ==========================================
        // GET CROP
        // ==========================================

        const [crops] = await pool.query(
            `
            SELECT
                crop_id,
                crop_name,
                description,
                growing_period,
                harvest_period

            FROM crops

            WHERE crop_id = ?
            `,
            [cropId]
        );


        if (crops.length === 0) {

            return res.status(404).json({

                success: false,

                message:
                    "Crop not found."

            });

        }


        // ==========================================
        // GET CROP REQUIREMENTS
        // ==========================================

        const [requirements] = await pool.query(
            `
            SELECT
                requirement_id,
                crop_id,
                soil_type,
                water_requirement,
                sunlight_requirement,
                min_temperature,
                max_temperature,
                environment

            FROM crop_requirements

            WHERE crop_id = ?
            `,
            [cropId]
        );


        // ==========================================
        // RETURN CROP + REQUIREMENTS
        // ==========================================

        res.json({

            success: true,

            crop: crops[0],

            requirements:
                requirements[0] || null

        });


    } catch (error) {

        console.error(
            "Get Crop Error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                "Failed to retrieve crop."

        });

    }

});


module.exports = router;

