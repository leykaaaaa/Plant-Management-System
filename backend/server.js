const express = require("express");
const cors = require("cors");
require("dotenv").config();

const cropRoutes = require("./routes/cropRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const userRoutes = require("./routes/userRoutes");
const calendarRoutes = require("./routes/calendarRoutes");


const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// ROOT ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.json({
        message: "Welcome to Build and Bloom API"
    });

});


// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api/crops",
    cropRoutes
);

app.use(
    "/api/recommendations",
    recommendationRoutes
);

app.use(
    "/api/weather",
    weatherRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/calendar",
    calendarRoutes
);


// ==========================================
// SERVER
// ==========================================

const PORT =
    process.env.PORT || 5000;


app.listen(PORT, () => {

    console.log(
        `Build and Bloom server running on port ${PORT}`
    );

});