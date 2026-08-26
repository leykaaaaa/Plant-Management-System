const express = require("express");
const pool = require("../config/db");

const router = express.Router();


// Get planting calendar
router.get("/", async (req, res) => {

    try {

        const [calendar] = await pool.query(`

            SELECT
                planting_calendar.calendar_id,
                planting_calendar.crop_id,
                crops.crop_name,
                planting_calendar.location,
                planting_calendar.planting_month,
                planting_calendar.season

            FROM planting_calendar

            INNER JOIN crops
                ON planting_calendar.crop_id =
                   crops.crop_id

            ORDER BY
                crops.crop_name,
                planting_calendar.location

        `);


        res.json({

            success: true,

            calendar

        });

    } catch (error) {

        console.error(
            "Planting Calendar Error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Failed to retrieve planting calendar."

        });

    }

});


module.exports = router;