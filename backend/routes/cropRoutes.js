const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [crops] = await pool.query(
            "SELECT * FROM crops ORDER BY crop_name"
        );

        res.json(crops);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve crops."
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const [crops] = await pool.query(
            "SELECT * FROM crops WHERE crop_id = ?",
            [req.params.id]
        );

        if (crops.length === 0) {
            return res.status(404).json({
                message: "Crop not found."
            });
        }

        res.json(crops[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to retrieve crop."
        });
    }
});

module.exports = router;