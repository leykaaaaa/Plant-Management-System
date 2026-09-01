import { Link } from "react-router-dom";
import "../styles/landing.css";

function LandingPage() {
    return (
        <div className="landing-page">

            {/* =========================
                PUBLIC NAVBAR
            ========================= */}

            <header className="landing-navbar">

                <Link
                    to="/"
                    className="landing-logo"
                >
                    Build & Bloom
                </Link>

                <nav className="landing-nav">

                    <a href="#about">
                        About
                    </a>

                    <a href="#features">
                        Features
                    </a>

                    <a href="#how-it-works">
                        How It Works
                    </a>

                    <Link
                        to="/login"
                        className="nav-login"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="nav-register"
                    >
                        Get Started
                    </Link>

                </nav>

            </header>


            <main>

                {/* =========================
                    HERO
                ========================= */}

                <section className="hero">

                    <div className="hero-content">

                        <p className="eyebrow">
                            CROP DECISION SUPPORT SYSTEM
                        </p>

                        <h1>
                            Grow Smarter
                            <span> Plant with Confidence</span>
                        </h1>

                        <p className="hero-description">
                            Build & Bloom helps you discover
                            which crops are suitable for your
                            location and growing conditions.
                        </p>

                        <div className="hero-actions">

                            <Link
                                to="/register"
                                className="primary-btn"
                            >
                                Get Started
                            </Link>

                            <a
                                href="#how-it-works"
                                className="secondary-btn"
                            >
                                Learn More
                            </a>

                        </div>

                    </div>

                </section>


                {/* =========================
                    ABOUT
                ========================= */}

                <section
                    className="landing-about"
                    id="about"
                >

                    <div className="section-heading">

                        <p className="eyebrow">
                          About BUILD & BLOOM
                        </p>

                        <h2>
                            Make better planting decisions
                        </h2>

                        <p>
                            Understand your growing conditions
                            and discover crops that are compatible
                            with your environment.
                        </p>

                    </div>

                </section>


                {/* =========================
                    FEATURES
                ========================= */}

                <section
                    className="landing-features"
                    id="features"
                >

                    <div className="section-heading">

                        <p className="eyebrow">
                            FEATURES
                        </p>

                        <h2>
                            Everything you need to plan smarter
                        </h2>

                    </div>


                    <div className="feature-grid">

                        <article className="feature-card">

                            <div className="feature-icon">
                                
                            </div>

                            <h3>
                                Crop Assessment
                            </h3>

                            <p>
                                Analyze your soil, water,
                                sunlight, and growing environment
                                to find suitable crops.
                            </p>

                        </article>


                        <article className="feature-card">

                            <div className="feature-icon">
                                
                            </div>

                            <h3>
                                Weather Monitoring
                            </h3>

                            <p>
                                Check current weather conditions
                                and forecasts for your selected
                                location.
                            </p>

                        </article>


                        <article className="feature-card">

                            <div className="feature-icon">
                                
                            </div>

                            <h3>
                                Planting Calendar
                            </h3>

                            <p>
                                View suitable planting periods
                                for crops commonly grown in
                                Pangasinan.
                            </p>

                        </article>

                    </div>

                </section>


                {/* =========================
                    HOW IT WORKS
                ========================= */}

                <section
                    className="how-it-works"
                    id="how-it-works"
                >

                    <div className="section-heading">

                        <p className="eyebrow">
                            HOW IT WORKS
                        </p>

                        <h2>
                            Start growing with confidence
                        </h2>

                    </div>


                    <div className="steps-grid">

                        <div className="step">

                            <span className="step-number">
                                01
                            </span>

                            <h3>
                                Create an account
                            </h3>

                            <p>
                                Register your account and
                                select your farming location.
                            </p>

                        </div>


                        <div className="step">

                            <span className="step-number">
                                02
                            </span>

                            <h3>
                                Assess your conditions
                            </h3>

                            <p>
                                Provide information about
                                your soil, water, sunlight,
                                and environment.
                            </p>

                        </div>


                        <div className="step">

                            <span className="step-number">
                                03
                            </span>

                            <h3>
                                Get recommendations
                            </h3>

                            <p>
                                Build & Bloom analyzes your
                                conditions and recommends
                                suitable crops.
                            </p>

                        </div>

                    </div>

                </section>


                {/* =========================
                    CTA
                ========================= */}

                <section className="landing-cta">

                    <div>

                        <p className="eyebrow">
                            READY TO START?
                        </p>

                        <h2>
                            Find the right crop
                            for your conditions.
                        </h2>

                        <p>
                            Let Build & Bloom help you make
                            informed planting decisions.
                        </p>

                        <Link
                            to="/register"
                            className="primary-btn"
                        >
                            Create Your Account 
                        </Link>

                    </div>

                </section>

            </main>


            {/* =========================
                FOOTER
            ========================= */}

            <footer className="landing-footer">

                <div>

                    <strong>
                        Build & Bloom
                    </strong>

                    <p>
                        Crop Management Decision
                        Support System
                    </p>

                </div>


                <p>
                    © 2026 Build & Bloom: Plant Management Decision Support System
                </p>

            </footer>

        </div>
    );
}

export default LandingPage;