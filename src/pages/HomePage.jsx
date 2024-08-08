import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Footer from "./footer/Footer";
import BgSliderMobile from "../components/BgSlider";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { firestore, collection, getDocs } from "../firebase/firebase";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "./HomePage.css";

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [upcoming, setUpcoming] = useState([]);

    const settings = {
        infinite: true,
        speed: 800,
        slidesToShow: 3, 
        slidesToScroll: 1,
        pauseOnHover: false,
        arrows: true, 
    };

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
        const fetchUpcomingMovies = async () => {
            try {
                const upcomingMoviesCollection = collection(firestore, "upcoming");
                const upcomingMovieSnapshot = await getDocs(upcomingMoviesCollection);
                const upcomingMovieList = upcomingMovieSnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setUpcoming(upcomingMovieList);
            } catch (error) {
                console.error("Error fetching movies: ", error);
            }
        };

        document.title = "CineWave | Homepage";
        fetchUpcomingMovies();
        fetchMovies();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container homepage-container">
                <div className="homepage-content">
                    <Link to="/vision">
                        <button className="learnMore" id="buttonHomepage">
                            See films <i class="bi bi-emoji-heart-eyes-fill"></i>
                        </button>
                    </Link>
                    <Link to="/vision">
                        <BgSliderMobile />
                    </Link>
                </div>
                <br />
                <br />
                <h2 style={{color:'#55C1FF'}}>Vision Movies <i class="bi bi-stars"></i> </h2>
                <Slider {...settings}>
                    {movies.map((movie) => (
                        <div className="card-slide" key={movie.id}>
                            <Card
                                title={movie.title}
                                desc={movie.description}
                                img={movie.imageUrl}
                                movieId={movie.id}
                            />
                        </div>
                    ))}
                </Slider>
                <br /> <br /> <br />
                <h2 style={{color:'#55C1FF'}}>Upcoming Movies <i class="bi bi-hourglass-split"></i></h2>
                <Slider {...settings}>
                    {upcoming.map((upcoming) => (
                        <div className="card-slide" key={upcoming.id}>
                            <Card
                                title={upcoming.title}
                                desc={upcoming.description}
                                img={upcoming.imageUrl}
                                movieId={upcoming.id}
                            />
                        </div>
                    ))}
                </Slider>
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
