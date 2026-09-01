import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/calendar.css";
import Navbar from "../components/Navbar";

function PlantingCalendar() {
    const navigate = useNavigate();

    const [calendar, setCalendar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const storedUser = localStorage.getItem("buildBloomUser");

        if (!storedUser) {
            navigate("/login");
            return;
        }

        loadPlantingCalendar();
    }, [navigate]);

    async function loadPlantingCalendar() {
        try {
            const response = await fetch(
                "http://localhost:5000/api/calendar"
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Unable to load planting calendar."
                );
            }

            setCalendar(data.calendar || []);

        } catch (err) {
            console.error(
                "Planting Calendar Error:",
                err
            );

            setError(
                "Unable to load planting calendar. Please make sure the Build & Bloom server is running."
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />

            <main className="calendar-page">

                {/* =========================
                    PAGE HEADER
                ========================= */}

                <section className="calendar-heading">

                    <p className="eyebrow">
                        PLANTING CALENDAR
                    </p>

                    <h1>
                        Know when to plant
                    </h1>

                    <p>
                        Explore recommended planting periods
                        for crops across Pangasinan.
                    </p>

                </section>


                {/* =========================
                    CONTENT
                ========================= */}

                <section className="calendar-content">

                    {loading && (
                        <div className="calendar-message">
                            Loading planting calendar...
                        </div>
                    )}


                    {error && (
                        <div className="calendar-error">
                            ❌ {error}
                        </div>
                    )}


                    {!loading &&
                        !error &&
                        calendar.length === 0 && (

                            <div className="calendar-empty">

                                <div className="calendar-empty-icon">
                                    
                                </div>

                                <h2>
                                    No planting information yet
                                </h2>

                                <p>
                                    Planting schedule information
                                    will appear here once
                                    agricultural data has been added.
                                </p>

                            </div>

                        )}


                    {!loading &&
                        !error &&
                        calendar.length > 0 && (

                            <div className="calendar-grid">

                                {calendar.map((item, index) => (

                                    <article
                                        className="calendar-card"
                                        key={
                                            item.calendar_id ||
                                            index
                                        }
                                    >

                                        <div className="calendar-card-icon">
                                            
                                        </div>

                                        <div className="calendar-card-content">

                                            <h2>
                                                {item.crop_name}
                                            </h2>

                                            <p className="calendar-location">
                                                📍 {item.location}
                                            </p>


                                            <div className="calendar-info">

                                                <div className="calendar-info-item">

                                                    <span>
                                                        Planting Period
                                                    </span>

                                                    <strong>
                                                        {item.planting_month ||
                                                            "Not specified"}
                                                    </strong>

                                                </div>


                                                <div className="calendar-info-item">

                                                    <span>
                                                        Season
                                                    </span>

                                                    <strong>
                                                        {item.season ||
                                                            "Not specified"}
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>

                                    </article>

                                ))}

                            </div>

                        )}

                </section>


                {/* =========================
                    BACK TO DASHBOARD
                ========================= */}

                <div className="calendar-footer">

                    <Link
                        to="/dashboard"
                        className="back-link"
                    >
                        ← Back to Dashboard
                    </Link>

                </div>

            </main>
        </>
    );
}

export default PlantingCalendar;