
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        location: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // ==========================================
    // HANDLE REGISTER
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // ==========================================
        // VALIDATE FIELDS
        // ==========================================

        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.location
        ) {

            setError(
                "Please complete all fields."
            );

            return;
        }


        // ==========================================
        // CHECK PASSWORD
        // ==========================================

        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        // ==========================================
        // PASSWORD LENGTH
        // ==========================================

        if (
            formData.password.length < 6
        ) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        setLoading(true);


        try {

            // ==========================================
            // SEND REGISTRATION TO BACKEND
            // ==========================================

            const response = await fetch(
                "http://localhost:5000/api/users/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name:
                            formData.name.trim(),

                        email:
                            formData.email.trim(),

                        password:
                            formData.password,

                        location:
                            formData.location

                    })
                }
            );


            const data =
                await response.json();


            // ==========================================
            // HANDLE BACKEND ERROR
            // ==========================================

            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Unable to create account."
                );

            }


            // ==========================================
            // REGISTRATION SUCCESSFUL
            // ==========================================

            alert(
                "Registration successful! Please login."
            );

            navigate("/login");


        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );

            setError(
                error.message ||
                "Unable to register."
            );


        } finally {

            setLoading(false);

        }

    };


    return (

        <main className="register-page">

            <section className="register-container">

                <div className="register-card">


                    {/* =========================
                        HEADER
                    ========================= */}

                    <div className="register-header">

                        <div className="register-logo">
                            
                        </div>

                        <p className="eyebrow">
                            BUILD & BLOOM
                        </p>

                        <h1>
                            Create your account
                        </h1>

                        <p>
                            Start making smarter crop
                            decisions for your farm.
                        </p>

                    </div>


                    {/* =========================
                        FORM
                    ========================= */}

                    <form
                        className="register-form"
                        onSubmit={handleSubmit}
                    >


                        {/* ERROR */}

                        {error && (

                            <div className="register-error">
                                ❌ {error}
                            </div>

                        )}


                        {/* NAME */}

                        <div className="form-group">

                            <label htmlFor="name">
                                Full Name
                            </label>

                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* LOCATION */}

                        <div className="form-group">

                            <label htmlFor="location">
                                Farming Location
                            </label>

                            <select
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select your location
                                </option>

                                <option value="Dagupan">
                                    Dagupan
                                </option>

                                <option value="Lingayen">
                                    Lingayen
                                </option>

                                <option value="Urdaneta">
                                    Urdaneta
                                </option>

                                <option value="Santa Barbara">
                                    Santa Barbara
                                </option>

                                <option value="San Carlos">
                                    San Carlos
                                </option>

                            </select>

                        </div>


                        {/* PASSWORDS */}

                        <div className="form-row">

                            <div className="form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Create password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label htmlFor="confirmPassword">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="register-btn"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Account "}

                        </button>

                    </form>


                    {/* =========================
                        FOOTER
                    ========================= */}

                    <div className="register-footer">

                        <p>
                            Already have an account?
                            {" "}

                            <Link to="/login">
                                Login
                            </Link>
                        </p>

                    </div>

                </div>

            </section>

        </main>

    );

}

export default Register;
