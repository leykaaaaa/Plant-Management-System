import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/profile.css";
import Navbar from "../components/Navbar";

function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser =
            localStorage.getItem("buildBloomUser");

        if (!storedUser) {
            navigate("/login");
            return;
        }

        try {
            setUser(JSON.parse(storedUser));
        } catch (error) {
            console.error("Invalid stored user:", error);

            localStorage.removeItem("buildBloomUser");
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("buildBloomUser");
        localStorage.removeItem("latestAssessment");

        navigate("/login");
    };

    if (!user) {
        return (
            <main className="profile-page">
                <p>Loading profile...</p>
            </main>
        );
    }

    return (
        <>
            <Navbar />

            <main className="profile-page">

                {/* =========================
                    PAGE HEADER
                ========================= */}

                <section className="profile-heading">

                    <p className="eyebrow">
                        MY PROFILE
                    </p>

                    <h1>
                        Your Account
                    </h1>

                    <p>
                        View your account information
                        and farming location.
                    </p>

                </section>


                {/* =========================
                    PROFILE CARD
                ========================= */}

                <section className="profile-container">

                    <div className="profile-card">

                        {/* PROFILE AVATAR */}

                        <div className="profile-avatar">
                            {user.name
                                ? user.name
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"}
                        </div>


                        <div className="profile-title">

                            <h2>
                                {user.name || "User"}
                            </h2>

                            <p>
                                Build & Bloom Farmer
                            </p>

                        </div>


                        {/* ACCOUNT INFORMATION */}

                        <div className="profile-information">

                            <div className="profile-item">

                                <span className="profile-item-icon">
                                    👤
                                </span>

                                <div>
                                    <small>
                                        Full Name
                                    </small>

                                    <strong>
                                        {user.name ||
                                            "Not available"}
                                    </strong>
                                </div>

                            </div>


                            <div className="profile-item">

                                <span className="profile-item-icon">
                                    ✉️
                                </span>

                                <div>
                                    <small>
                                        Email Address
                                    </small>

                                    <strong>
                                        {user.email ||
                                            "Not available"}
                                    </strong>
                                </div>

                            </div>


                            <div className="profile-item">

                                <span className="profile-item-icon">
                                    📍
                                </span>

                                <div>
                                    <small>
                                        Farming Location
                                    </small>

                                    <strong>
                                        {user.location ||
                                            "Not set"}
                                    </strong>
                                </div>

                            </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="profile-actions">

                            <Link
                                to="/dashboard"
                                className="profile-btn secondary"
                            >
                                ← Dashboard
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="profile-btn logout"
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </section>

            </main>
        </>
    );
}

export default Profile;