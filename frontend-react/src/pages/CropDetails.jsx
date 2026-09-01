
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/cropDetails.css";

function CropDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [crop, setCrop] = useState(null);
    const [requirements, setRequirements] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // LOAD CROP DETAILS
    // ==========================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("buildBloomUser");

        if (!storedUser) {
            navigate("/login");
            return;
        }

        loadCrop();

    }, [id, navigate]);


    async function loadCrop() {

        try {

            const response = await fetch(
                `http://localhost:5000/api/crops/${id}`
            );

            const data = await response.json();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Unable to load crop information."
                );

            }

            setCrop(data.crop);
            setRequirements(data.requirements);

        } catch (error) {

            console.error(
                "Crop Details Error:",
                error
            );

            setError(
                error.message ||
                "Unable to load crop information."
            );

        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <>
                <Navbar />

                <main className="crop-details-page">

                    <div className="crop-details-message">
                        Loading crop information...
                    </div>

                </main>
            </>
        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error || !crop) {

        return (
            <>
                <Navbar />

                <main className="crop-details-page">

                    <div className="crop-details-error">

                        <div className="crop-details-error-icon">
                            ✖
                        </div>

                        <h2>
                            Crop information unavailable
                        </h2>

                        <p>
                            {error ||
                                "The requested crop could not be found."}
                        </p>

                        <Link
                            to="/crop-catalogue"
                            className="secondary-btn"
                        >
                            ← Back to Catalogue
                        </Link>

                    </div>

                </main>
            </>
        );

    }


    return (

        <>
            <Navbar />

            <main className="crop-details-page">

                {/* ==================================
                    BACK LINK
                ================================== */}

                <div className="crop-details-top">

                    <Link
                        to="/crop-catalogue"
                        className="back-link"
                    >
                        ← Back to Catalogue
                    </Link>

                </div>


                {/* ==================================
                    HERO
                ================================== */}

                <section className="crop-details-hero">

                    <div className="crop-details-icon">
                        
                    </div>

                    <div className="crop-details-hero-content">

                        <p className="eyebrow">
                            CROP INFORMATION
                        </p>

                        <h1>
                            {crop.crop_name}
                        </h1>

                        <p>
                            {crop.description ||
                                "No description available."}
                        </p>

                    </div>

                </section>


                {/* ==================================
                    BASIC INFORMATION
                ================================== */}

                <section className="crop-details-section">

                    <div className="section-heading">

                        <p className="eyebrow">
                            GROWTH INFORMATION
                        </p>

                        <h2>
                            Growing & Harvesting
                        </h2>

                    </div>


                    <div className="growth-grid">

                        <div className="growth-card">

                            <span className="growth-icon">
                                
                            </span>

                            <div>

                                <span>
                                    Growing Period
                                </span>

                                <strong>
                                    {crop.growing_period ||
                                        "Not specified"}
                                </strong>

                            </div>

                        </div>


                        <div className="growth-card">

                            <span className="growth-icon">
                                🧺
                            </span>

                            <div>

                                <span>
                                    Harvest Period
                                </span>

                                <strong>
                                    {crop.harvest_period ||
                                        "Not specified"}
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ==================================
                    REQUIREMENTS
                ================================== */}

                <section className="crop-details-section">

                    <div className="section-heading">

                        <p className="eyebrow">
                            GROWING REQUIREMENTS
                        </p>

                        <h2>
                            What does {crop.crop_name} need?
                        </h2>

                        <p>
                            These requirements are based on
                            the agricultural information currently
                            stored in Build & Bloom.
                        </p>

                    </div>


                    {requirements ? (

                        <div className="requirements-grid">

                            {/* SOIL */}

                            <div className="requirement-card">

                                <div className="requirement-icon">
                                    🪴
                                </div>

                                <span>
                                    Soil Type
                                </span>

                                <strong>
                                    {requirements.soil_type ||
                                        "Not specified"}
                                </strong>

                            </div>


                            {/* WATER */}

                            <div className="requirement-card">

                                <div className="requirement-icon">
                                    💧
                                </div>

                                <span>
                                    Water Requirement
                                </span>

                                <strong>
                                    {requirements.water_requirement ||
                                        "Not specified"}
                                </strong>

                            </div>


                            {/* SUNLIGHT */}

                            <div className="requirement-card">

                                <div className="requirement-icon">
                                    ☀️
                                </div>

                                <span>
                                    Sunlight
                                </span>

                                <strong>
                                    {requirements.sunlight_requirement ||
                                        "Not specified"}
                                </strong>

                            </div>


                            {/* TEMPERATURE */}

                            <div className="requirement-card">

                                <div className="requirement-icon">
                                    🌡️
                                </div>

                                <span>
                                    Temperature
                                </span>

                                <strong>

                                    {requirements.min_temperature != null &&
                                    requirements.max_temperature != null
                                        ? `${requirements.min_temperature}°C – ${requirements.max_temperature}°C`
                                        : "Not specified"}

                                </strong>

                            </div>


                            {/* ENVIRONMENT */}

                            <div className="requirement-card">

                                <div className="requirement-icon">
                                    🌿
                                </div>

                                <span>
                                    Growing Environment
                                </span>

                                <strong>
                                    {requirements.environment ||
                                        "Not specified"}
                                </strong>

                            </div>

                        </div>

                    ) : (

                        <div className="requirements-empty">

                            <span>
                                🌱
                            </span>

                            <p>
                                Growing requirement information
                                has not been added yet.
                            </p>

                        </div>

                    )}

                </section>


                {/* ==================================
                    ACTIONS
                ================================== */}

                <section className="crop-details-actions">

                    <div>

                        <p className="eyebrow">
                            READY TO DECIDE?
                        </p>

                        <h2>
                            Want to grow {crop.crop_name}?
                        </h2>

                        <p>
                            Check whether this crop is compatible
                            with your current growing conditions.
                        </p>

                    </div>


                    <div className="crop-action-buttons">

                        <Link
                            to={`/crop-assessment?crop=${crop.crop_id}`}
                            className="primary-btn"
                        >
                            Check Compatibility
                        </Link>

                        <Link
                            to={`/plant-plan/new?crop=${crop.crop_id}`}
                            className="secondary-btn"
                        >
                            Plan This Plant
                        </Link>

                    </div>

                </section>

            </main>
        </>
    );

}

export default CropDetails;

