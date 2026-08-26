const express = require("express");
const cors = require("cors");
require("dotenv").config();

const cropRoutes = require("./routes/cropRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const weatherRoutes = require("./routes/weatherRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Build and Bloom API"
    });
});

app.use("/api/crops", cropRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/weather", weatherRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Build and Bloom server running on port ${PORT}`);
});

const calendarRoutes =
    require("./routes/calendarRoutes");

app.use(
    "/api/calendar",
    calendarRoutes
);

