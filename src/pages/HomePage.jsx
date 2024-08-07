import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Footer from "./footer/Footer";
import BgSliderMobile from "../components/BgSlider";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { firestore, collection, getDocs } from "../firebase/firebase";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    useGSAP(() => {
        gsap.from(".text", 0.8, {
            y: 40,
            opacity: 0,
            ease: "power2.inOut",
            delay: 0.7,
        });
        gsap.from(".loader", 2, {
            width: 0,
            ease: "power4.inOut",
            delay: 1,
        });

        gsap.to(".pre-loader", 2, {
            top:"-100%",
            ease: "power4.inOut",
            delay: 2,
        });
    });
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const moviesCollection = collection(firestore, "movies");
                const movieSnapshot = await getDocs(moviesCollection);
                const movieList = movieSnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setMovies(movieList);
            } catch (error) {
                console.error("Error fetching movies: ", error);
            }
        };

        document.title = "CineWave | Homepage";
        fetchMovies();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container homepage-container">
                <div className="homepage-content">
                    <Link to="/vision">
                        <button className="learnMore" id="buttonHomepage">
                            See films
                        </button>
                    </Link>
                    <Link to="/vision">
                        <BgSliderMobile />
                    </Link>
                </div>
                <br />
                <br />
                <div className="container-fluid secondSection">
                    <h3>Vision Movies</h3>
                    <div className="row">
                        {movies.map((movie) => (
                            <div className="col-md-4 cardHomepage" key={movie.id}>
                                <Card
                                    title={movie.title}
                                    desc={movie.description}
                                    img={movie.imageUrl}
                                    movieId={movie.id}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="pre-loader">
                    <div className="content">
                        <div className="text">
                            <h1>CineWave</h1>
                        </div>
                        <div className="loader"></div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default HomePage;
