import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import CardComing from "../components/cardcoming/CardComing";
import Footer from "./footer/Footer";
import BgSliderMobile from "../components/BgSlider";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { firestore, collection, getDocs } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Popcorn from "../assets/popcorn.png";
import "./HomePage.css";

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [upcoming, setUpcoming] = useState([]);

    const navigate = useNavigate();

    const settings = {
        infinite: true,
        speed: 1000,
        slidesToShow: 4,
        slidesToScroll: 1,
        pauseOnHover: false,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 10000,
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
            top: "-100%",
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
                const upcomingMoviesCollection = collection(
                    firestore,
                    "upcoming"
                );
                const upcomingMovieSnapshot = await getDocs(
                    upcomingMoviesCollection
                );
                const upcomingMovieList = upcomingMovieSnapshot.docs.map(
                    (doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    })
                );
                setUpcoming(upcomingMovieList);
            } catch (error) {
                console.error("Error fetching movies: ", error);
            }
        };

        document.title = "CineWave | Homepage";
        fetchUpcomingMovies();
        fetchMovies();
    }, []);

    const redirectVision = () =>{
        navigate("/vision")
    }
    const redirectComing = () =>{
        navigate("/soon")
    }

    return (
        <div>
            <Navbar />
            <div className="container homepage-container">
                <div className="homepage-content">
                    <Link to="/vision">
                        <button className="learnMore" id="buttonHomepage">
                            Explore movies{" "}
                            <i className="bi bi-emoji-heart-eyes-fill"></i>
                        </button>
                    </Link>
                    <Link to="/vision">
                        <BgSliderMobile />
                    </Link>
                </div>
                <br />
                <br />
                <br />
                <br />
                <div className="container-fluid visionSection"> 
                <h2 style={{ color: "#55C1FF" }}>
                    <i className="bi bi-stars"></i> Vision Movies{" "}
                    <span className="seeAll" onClick={redirectVision}>See all ➤</span>{" "}
                </h2>
                <Slider {...settings}>
                    {movies.map((movie) => (
                        <div className="card-slide" key={movie.id}>
                            <Card
                                title={movie.title}
                                desc={movie.description}
                                img={movie.imageUrl}
                                movieId={movie.id}
                                type={movie.type}
                            />
                        </div>
                    ))}
                </Slider>
                </div>
                <br /> <br />
                <div className="container-fluid comingSection">
                <h2 style={{ color: "#55C1FF" }}>
                    <i className="bi bi-hourglass-split"></i> Coming Soon{" "}
                    <span className="seeAll" onClick={redirectComing}>See all ➤</span>{" "}
                </h2>
                <Slider {...settings}>
                    {upcoming.map((upcoming) => (
                        <div className="card-slide" key={upcoming.id}>
                            <CardComing
                                title={upcoming.title}
                                desc={upcoming.description}
                                img={upcoming.imageUrl}
                                movieId={upcoming.id}
                                date={upcoming.date}
                            />
                        </div>
                    ))}
                </Slider>
                </div>
                <div className="container-fluid campaignSection">
                    <h2 style={{ color: "#55C1FF" }}>
                        <i className="bi bi-tag"></i> Campaigns{" "}
                    </h2>
                    <br />
                    <div className="form-container bg-dark campaignForm">
                        <h4>Get 10% off with CineWave Card at the buffet!</h4>
                        <p style={{ color: "lightgray" }}>
                            Great news for movie lovers! Enjoy more of your
                            favorite films with our special offer. Purchase your
                            snacks using a cinema card and receive a 10%
                            discount on your total purchase at the buffet!
                        </p>
                        <img
                            src={Popcorn}
                            alt=""
                            style={{ width: "25rem", marginLeft: "2rem" }}
                            className="cardpng"
                        />
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
