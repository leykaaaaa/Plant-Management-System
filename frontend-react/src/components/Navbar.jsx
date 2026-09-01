
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const storedUser = localStorage.getItem("buildBloomUser");
    const isLoggedIn = !!storedUser;

    const handleLogout = () => {
        localStorage.removeItem("buildBloomUser");
        localStorage.removeItem("latestAssessment");

        navigate("/login");
    };

    return (
        <header className="navbar">

            {/* =========================
                LOGO
            ========================= */}

            <Link to="/" className="navbar-logo">
                Build & Bloom
            </Link>


            {/* =========================
                NAVIGATION
            ========================= */}

            <nav className="navbar-links">

                {/* PUBLIC NAVIGATION */}

                {!isLoggedIn && (
                    <>
                        <Link
                            to="/"
                            className={
                                location.pathname === "/"
                                    ? "active"
                                    : ""
                            }
                        >
                            Home
                        </Link>

                        <Link
                            to="/login"
                            className={
                                location.pathname === "/login"
                                    ? "active"
                                    : ""
                            }
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className={
                                location.pathname === "/register"
                                    ? "active"
                                    : ""
                            }
                        >
                            Register
                        </Link>
                    </>
                )}


                {/* PROTECTED NAVIGATION */}

                {isLoggedIn && (
                    <>
                        <Link
                            to="/dashboard"
                            className={
                                location.pathname === "/dashboard"
                                    ? "active"
                                    : ""
                            }
                        >
                            Dashboard
                        </Link>

                        <Link
                        to="/catalogue"
                        className={
                            location.pathname === "/catalogue"
                                ? "active"
                                : ""
                        }
                    >
                        Catalogue
                    </Link>

                        <Link
                            to="/crop-assessment"
                            className={
                                location.pathname === "/crop-assessment"
                                    ? "active"
                                    : ""
                            }
                        >
                            Crop Assessment
                        </Link>

                        <Link
                            to="/planting-calendar"
                            className={
                                location.pathname === "/planting-calendar"
                                    ? "active"
                                    : ""
                            }
                        >
                            Planting Calendar
                        </Link>

                        <Link
                            to="/weather"
                            className={
                                location.pathname === "/weather"
                                    ? "active"
                                    : ""
                            }
                        >
                            Weather
                        </Link>

                        <Link
                            to="/profile"
                            className={
                                location.pathname === "/profile"
                                    ? "active"
                                    : ""
                            }
                        >
                            Profile
                        </Link>

                        <button
                            type="button"
                            className="navbar-logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}

            </nav>

        </header>
    );
}

export default Navbar;


