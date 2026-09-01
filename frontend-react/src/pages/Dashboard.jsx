import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import Navbar from "../components/Navbar";

function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [weather, setWeather] = useState(null);
    const [recommendation, setRecommendation] = useState(null);

    const [loadingWeather, setLoadingWeather] = useState(true);
    const [loadingRecommendation, setLoadingRecommendation] = useState(true);


    // ==========================================
    // PANGASINAN LOCATIONS
    // ==========================================

    const pangasinanLocations = {

        Dagupan: {
            latitude: 16.0433,
            longitude: 120.3333
        },

        Lingayen: {
            latitude: 16.0217,
            longitude: 120.2319
        },

        Urdaneta: {
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


    // ==========================================
    // LOAD USER
    // ==========================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("buildBloomUser");

        if (!storedUser) {

            navigate("/login");

            return;

        }

        try {

            setUser(
                JSON.parse(storedUser)
            );

        } catch (error) {

            console.error(
                "Invalid stored user:",
                error
            );

            localStorage.removeItem(
                "buildBloomUser"
            );

            navigate("/login");

        }

    }, [navigate]);


    // ==========================================
    // LOAD WEATHER
    // ==========================================

    useEffect(() => {

        if (!user) return;

        const coordinates =
            pangasinanLocations[user.location];

        if (!coordinates) {

            setLoadingWeather(false);

            return;

        }


        async function loadWeather() {

            try {

                const response =
                    await fetch(
                        `http://localhost:5000/api/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}`
                    );

                const data =
                    await response.json();

                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Unable to retrieve weather."
                    );

                }

                setWeather(
                    data.weather
                );

            } catch (error) {

                console.error(
                    "Dashboard Weather Error:",
                    error
                );

            } finally {

                setLoadingWeather(false);

            }

        }


        loadWeather();

    }, [user]);


    // ==========================================
    // LOAD LATEST ASSESSMENT
    // ==========================================

    useEffect(() => {

        if (!user) return;

        const storedAssessment =
            localStorage.getItem(
                "latestAssessment"
            );

        if (!storedAssessment) {

            setLoadingRecommendation(false);

            return;

        }


        try {

            const conditions =
                JSON.parse(
                    storedAssessment
                );


            async function loadRecommendation() {

                try {

                    const response =
                        await fetch(
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
                            "Unable to generate recommendation."
                        );

                    }


                    if (
                        data.recommendations &&
                        data.recommendations.length > 0
                    ) {

                        setRecommendation(
                            data.recommendations[0]
                        );

                    }

                } catch (error) {

                    console.error(
                        "Dashboard Recommendation Error:",
                        error
                    );

                } finally {

                    setLoadingRecommendation(false);

                }

            }


            loadRecommendation();

        } catch (error) {

            console.error(
                "Invalid assessment:",
                error
            );

            setLoadingRecommendation(false);

        }

    }, [user]);


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem(
            "buildBloomUser"
        );

        localStorage.removeItem(
            "latestAssessment"
        );

        navigate("/login");

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (!user) {

        return (
            <>
                <Navbar />

                <main className="dashboard-page">

                    <p>
                        Loading dashboard...
                    </p>

                </main>
            </>
        );

    }


    // ==========================================
    // DASHBOARD
    // ==========================================

    return (

        <>
            <Navbar />

            <main className="dashboard-page">

                {/* =========================
                    WELCOME
                ========================= */}

                <section className="dashboard-welcome">

                    <div>

                        <p className="eyebrow">
                            YOUR DASHBOARD
                        </p>

                        <h1>
                            Welcome back,{" "}
                            <span>
                                {user.name || "User"}
                            </span>! ⚘
                        </h1>

                        <p>
                            Here's an overview of your
                            farming conditions and
                            recommendations.
                        </p>

                    </div>


                    <div className="location-card">

                        <span>
                            📍
                        </span>

                        <div>

                            <small>
                                Your Location
                            </small>

                            <strong>
                                {user.location ||
                                    "Not set"}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* =========================
                    DASHBOARD GRID
                ========================= */}

                <section className="dashboard-grid">


                    {/* WEATHER */}

                    <article className="dashboard-card">

                        <div className="card-header">

                            <div>

                                <p className="eyebrow">
                                    WEATHER
                                </p>

                                <h2>
                                    Current Conditions
                                </h2>

                            </div>

                            <span className="card-icon">
                                🌦️
                            </span>

                        </div>


                        {loadingWeather ? (

                            <p>
                                Loading weather...
                            </p>

                        ) : weather ? (

                            <div className="dashboard-weather">

                                <div className="dashboard-temperature">

                                    {Math.round(
                                        weather.temperature
                                    )}°C

                                </div>

                                <div className="dashboard-condition">

                                    {weather.description}

                                </div>

                                <div className="dashboard-weather-details">

                                    <div>

                                        💧

                                        <strong>
                                            {weather.humidity}%
                                        </strong>

                                        <small>
                                            Humidity
                                        </small>

                                    </div>


                                    <div>

                                        🌧️

                                        <strong>
                                            {weather.rainfall} mm
                                        </strong>

                                        <small>
                                            Rainfall
                                        </small>

                                    </div>


                                    <div>

                                        💨

                                        <strong>
                                            {weather.windSpeed} m/s
                                        </strong>

                                        <small>
                                            Wind
                                        </small>

                                    </div>

                                </div>

                            </div>

                        ) : (

                            <p>
                                Weather unavailable.
                            </p>

                        )}

                    </article>


                    {/* RECOMMENDATION */}

                    <article className="dashboard-card">

                        <div className="card-header">

                            <div>

                                <p className="eyebrow">
                                    RECOMMENDATION
                                </p>

                                <h2>
                                    Suitable Crop
                                </h2>

                            </div>

                            <span className="card-icon">
                                🌾
                            </span>

                        </div>


                        {loadingRecommendation ? (

                            <p>
                                Loading recommendation...
                            </p>

                        ) : recommendation ? (

                            <div className="top-recommendation">

                                <div>

                                    <h3>
                                        🌱{" "}
                                        {recommendation.crop_name}
                                    </h3>

                                    <p>
                                        {recommendation.result}
                                    </p>

                                </div>

                                <strong>
                                    {recommendation.score}%
                                </strong>

                            </div>

                        ) : (

                            <p>
                                Complete a crop assessment
                                to receive recommendations.
                            </p>

                        )}


                        <Link
                            to="/crop-assessment"
                            className="dashboard-action"
                        >
                            Start Assessment →
                        </Link>

                    </article>


                    {/* CALENDAR */}

                    <article className="dashboard-card">

                        <div className="card-header">

                            <div>

                                <p className="eyebrow">
                                    PLANTING CALENDAR
                                </p>

                                <h2>
                                    Planting Period
                                </h2>

                            </div>

                            <span className="card-icon">
                                📅
                            </span>

                        </div>


                        <p>
                            View suitable planting
                            periods for your location.
                        </p>


                        <Link
                            to="/planting-calendar"
                            className="dashboard-action"
                        >
                            View Calendar →
                        </Link>

                    </article>


                    {/* PROFILE */}

                    <article className="dashboard-card">

                        <div className="card-header">

                            <div>

                                <p className="eyebrow">
                                    ACCOUNT
                                </p>

                                <h2>
                                    My Profile
                                </h2>

                            </div>

                            <span className="card-icon">
                                👤
                            </span>

                        </div>


                        <div className="profile-summary">

                            <p>

                                <strong>
                                    Name
                                </strong>

                                <span>
                                    {user.name}
                                </span>

                            </p>


                            <p>

                                <strong>
                                    Email
                                </strong>

                                <span>
                                    {user.email}
                                </span>

                            </p>


                            <p>

                                <strong>
                                    Location
                                </strong>

                                <span>
                                    {user.location}
                                </span>

                            </p>

                        </div>


                        <Link
                            to="/profile"
                            className="dashboard-action"
                        >
                            View Profile →
                        </Link>

                    </article>

                </section>


                {/* =========================
                    QUICK ACTIONS
                ========================= */}

                <section className="quick-actions">

                    <div className="section-heading">

                        <p className="eyebrow">
                            QUICK ACTIONS
                        </p>

                        <h2>
                            What would you like to do?
                        </h2>

                    </div>


                    <div className="quick-action-grid">


                        <Link
                            to="/crop-assessment"
                            className="quick-action"
                        >

                            <span>
                                🌱
                            </span>

                            <div>

                                <h3>
                                    Assess Crops
                                </h3>

                                <p>
                                    Find crops suitable
                                    for your current
                                    conditions.
                                </p>

                            </div>

                        </Link>


                        <Link
                            to="/weather"
                            className="quick-action"
                        >

                            <span>
                                🌦️
                            </span>

                            <div>

                                <h3>
                                    Check Weather
                                </h3>

                                <p>
                                    View current weather
                                    and upcoming forecast.
                                </p>

                            </div>

                        </Link>


                        <Link
                            to="/planting-calendar"
                            className="quick-action"
                        >

                            <span>
                                📅
                            </span>

                            <div>

                                <h3>
                                    Planting Calendar
                                </h3>

                                <p>
                                    Check suitable
                                    planting periods.
                                </p>

                            </div>

                        </Link>

                    </div>

                </section>

            </main>
        </>

    );

}

export default Dashboard;