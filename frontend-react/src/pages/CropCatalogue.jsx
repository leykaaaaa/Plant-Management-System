
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/catalogue.css";

function CropCatalogue() {

    const navigate = useNavigate();

    const [crops, setCrops] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================================
    // LOAD CROPS
    // ==========================================

    useEffect(() => {

        const storedUser =
            localStorage.getItem("buildBloomUser");

        if (!storedUser) {
            navigate("/login");
            return;
        }

        loadCrops();

    }, [navigate]);


    async function loadCrops() {

        try {

            const response = await fetch(
                "http://localhost:5000/api/crops"
            );

            const data = await response.json();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Unable to load crop catalogue."
                );

            }

            setCrops(data.crops || []);

        } catch (error) {

            console.error(
                "Crop Catalogue Error:",
                error
            );

            setError(
                "Unable to load the crop catalogue. Please make sure the Build & Bloom server is running."
            );

        } finally {

            setLoading(false);

        }

    }


    // ==========================================
    // FILTER CROPS
    // ==========================================

    const filteredCrops = crops.filter((crop) =>
        crop.crop_name
            .toLowerCase()
            .includes(search.toLowerCase())
    );


    return (

        <>
            <Navbar />

            <main className="catalogue-page">

                {/* =========================
                    HEADER
                ========================= */}

                <section className="catalogue-heading">

                    <p className="eyebrow">
                        CROP & PLANT CATALOGUE
                    </p>

                    <h1>
                        Discover what you can grow
                    </h1>

                    <p>
                        Explore crops and plants, learn about
                        their growing requirements, and decide
                        what you want to grow.
                    </p>

                </section>


                {/* =========================
                    SEARCH
                ========================= */}

                <section className="catalogue-tools">

                    <div className="search-box">

                        <span>
                            🔍︎
                        </span>

                        <input
                            type="text"
                            placeholder="Search crops or plants..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </section>


                {/* =========================
                    CONTENT
                ========================= */}

                <section className="catalogue-content">

                    {loading && (

                        <div className="catalogue-message">

                            Loading crop catalogue...

                        </div>

                    )}


                    {error && (

                        <div className="catalogue-error">

                            ✖ {error}

                        </div>

                    )}


                    {!loading &&
                        !error &&
                        crops.length === 0 && (

                            <div className="catalogue-empty">

                                <div className="catalogue-empty-icon">
                                    ⚘
                                </div>

                                <h2>
                                    No crops available yet
                                </h2>

                                <p>
                                    Crop information will appear
                                    here once agricultural data
                                    has been added.
                                </p>

                            </div>

                        )}


                    {!loading &&
                        !error &&
                        crops.length > 0 &&
                        filteredCrops.length === 0 && (

                            <div className="catalogue-empty">

                                <div className="catalogue-empty-icon">
                                    🔍︎
                                </div>

                                <h2>
                                    No crops found
                                </h2>

                                <p>
                                    Try searching for another
                                    crop or plant.
                                </p>

                            </div>

                        )}


                    {!loading &&
                        !error &&
                        filteredCrops.length > 0 && (

                            <div className="crop-catalogue-grid">

                                {filteredCrops.map((crop) => (

                                    <article
                                        className="catalogue-card"
                                        key={crop.crop_id}
                                    >

                                        <div className="catalogue-card-icon">
                                            ⚘
                                        </div>


                                        <div className="catalogue-card-body">

                                            <h2>
                                                {crop.crop_name}
                                            </h2>

                                            <p className="catalogue-description">
                                                {crop.description ||
                                                    "No description available."}
                                            </p>


                                            <div className="catalogue-meta">

                                                <div>

                                                    <span>
                                                        Growing Period
                                                    </span>

                                                    <strong>
                                                        {crop.growing_period ||
                                                            "Not specified"}
                                                    </strong>

                                                </div>


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


                                            <Link
                                                to={`/crops/${crop.crop_id}`}
                                                className="catalogue-btn"
                                            >
                                                View Details →
                                            </Link>

                                        </div>

                                    </article>

                                ))}

                            </div>

                        )}

                </section>

            </main>
        </>

    );

}

export default CropCatalogue;
