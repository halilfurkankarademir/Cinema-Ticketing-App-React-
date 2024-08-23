import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import CardComing from "../components/cardcoming/CardComing";
import Footer from "./footer/Footer";
import BgSliderMobile from "../components/BgSlider";
import gsap from "gsap";
import { firestore, collection, getDocs } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Modal from "react-modal";
import Popcorn from "../assets/popcorn.png";
import "./HomePage.css";

Modal.setAppElement("#root");

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [selectedTrailer, setSelectedTrailer] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

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
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 1201,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    useEffect(() => {
        gsap.fromTo(
            ".learnMore",
            { opacity: 0 },
            { opacity: 1, ease: "power4.inOut", duration: 1 }
        );
    }, []);

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

    const redirectVision = () => {
        navigate("/vision");
    };
    const redirectComing = () => {
        navigate("/soon");
    };

    const [videoVisible, setVideoVisible] = useState(false);

    const openVideo = (trailerUrl) => {
        setSelectedTrailer(trailerUrl);
        setVideoVisible(true);
    };

    const closeVideo = () => {
        setVideoVisible(false);
        setSelectedTrailer(null);
    };


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
                <div className="container-fluid visionSection">
                    <h2>
                        <i className="bi bi-stars"></i> Vision Movies{" "}
                        <span className="seeAll" onClick={redirectVision}>
                            See all ➤
                        </span>{" "}
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
                                    agelimit={movie.agelimit}
                                    duration={movie.duration}
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
                <br /> <br />
                <div className="container-fluid comingSection">
                    <h2>
                        <i className="bi bi-hourglass-split"></i> Coming Soon{" "}
                        <span className="seeAll" onClick={redirectComing}>
                            See all ➤
                        </span>{" "}
                    </h2>
                    <Slider {...settings}>
                        {upcoming.map((upcoming) => (
                            <div className="card-slide" key={upcoming.id}>
                                <CardComing
                                    title={upcoming.title}
                                    img={upcoming.imageUrl}
                                    movieId={upcoming.id}
                                    date={upcoming.date}
                                    type={upcoming.type}
                                    trailer={upcoming.trailerUrl}
                                    openModal={openVideo}
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
                <div className="container-fluid campaignSection mt-5">
                    <h2>
                        <i className="bi bi-tag"></i> Campaigns{" "}
                    </h2>
                    <br />
                    <div
                        className="form-container campaignForm"
                        style={{ backgroundColor: "#171a1d" }}
                    >
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
                            className="cardpng text-center"
                        />
                    </div>
                </div>
            </div>
            {selectedTrailer && (
                    <div className="video-player-overlay" onClick={closeVideo}>
                        <div className="video-player">
                            <iframe
                                width="100%"
                                height="480"
                                src={selectedTrailer}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}
            <Footer />
        </div>
    );
};

export default HomePage;
