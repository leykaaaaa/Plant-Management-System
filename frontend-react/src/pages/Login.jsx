import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:5000/api/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Invalid email or password."
                );

            }


            // Save logged-in user
            localStorage.setItem(
                "buildBloomUser",
                JSON.stringify(data.user)
            );


            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            setError(
                error.message ||
                "Unable to login."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <main className="auth-page">

            <section className="auth-card">

                <div className="auth-header">

                    <div className="auth-logo">
                        
                    </div>

                    <p className="eyebrow">
                        BUILD & BLOOM
                    </p>

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Sign in to access your
                        crop management dashboard.
                    </p>

                </div>


                {error && (

                    <div className="error-message">
                        ❌ {error}
                    </div>

                )}


                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Sign In "}

                    </button>

                </form>


                <div className="auth-footer">

                    <p>
                        Don't have an account?
                        {" "}
                        <Link to="/register">
                            Create an account
                        </Link>
                    </p>

                </div>

            </section>

        </main>

    );

}

export default Login;
