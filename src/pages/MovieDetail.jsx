import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { firestore, collection, getDocs,query,where, addDoc } from "../firebase/firebase";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetail.css";
import gsap from "gsap";
import CardOthers from "../components/CardOthers";
import Slider from "react-slick";
import { MdFamilyRestroom } from "react-icons/md";
import { MdOutlineFavorite } from "react-icons/md";
import { useAuth } from "../context/auth";
import toast, { Toaster } from 'react-hot-toast';

const MovieDetail = () => {
    const [movie, setMovie] = useState(null);
    const [movies, setMovies] = useState(null);
    const [comments, setComments] = useState([]);
    const [ratingMovie, setRatingMovie] = useState(0);
    const [isFavorite,setIsFavorite] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const {currentUser} = useAuth();

    document.title = "CineWave | Movie Details";

    const settings = {
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        pauseOnHover: false,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 8000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
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

    const avgRating = () => {
        let totalRating = 0;
        let numberOfRatings = comments.length;

        comments.forEach((cmt) => {
            totalRating += cmt.rating;
        });

        const averageRating =
            numberOfRatings > 0
                ? (totalRating / numberOfRatings).toFixed(1)
                : "No ratings yet";
        setRatingMovie(averageRating);
    };

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

        const fetchMovie = async () => {
            try {
                const moviesCollection = collection(firestore, "movies");
                const movieSnapshot = await getDocs(moviesCollection);
                const movieList = movieSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log("Movie List:", movieList);
                const selectedMovie = movieList.find(
                    (movie) => movie.id === id
                );

                if (selectedMovie) {
                    setMovie(selectedMovie);
                } else {
                    console.log("No matching movie found with ID:", id);
                }
            } catch (error) {
                console.error("Error fetching movie: ", error);
            }
        };
        fetchMovies();
        fetchMovie();
    }, [id]);

    useEffect(() => {
        avgRating();
    }, [comments]);

    useEffect(() => {
        gsap.from(".highQualityImg", {
            opacity: 0,
            scale: 1.3,
            ease: "power4.inOut",
            duration: 2,
        });
        gsap.from(".movie-desc2", {
            opacity: 0,
            y: 50,
            ease: "power4.inOut",
            duration: 2,
            delay: 1,
        });
        gsap.from(".others-section", {
            opacity: 0,
            y: 50,
            ease: "power4.inOut",
            duration: 2,
            delay: 1,
        });
    }, [movie]);

    const handleBuyTicket = () => {
        navigate(`/select-seat/${id}`, {
            state: {
                movieName: movie.title,
                img: movie.highImageUrl,
            },
        });
    };

    const handleTrailer = () => {
        const trailer = document.getElementById("trailerSection");
        trailer.style.display = "flex";
    };

    const closeTrailer = (e) => {
        if (e.target.id === "trailerSection") {
            const trailer = document.getElementById("trailerSection");
            const iframe = trailer.querySelector("iframe");
            trailer.style.display = "none";
            iframe.src = "";
            iframe.src = movie.trailer;
        }
    };
    const addFavorites = async () => {
        if (!movie) {
            return; 
        }
    
        try {
            const favoritesCollectionRef = collection(firestore, "users", currentUser.uid, "favorites");
            const q = query(favoritesCollectionRef, where("movieName", "==", movie.title));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                await addDoc(favoritesCollectionRef, {
                    movieId: movie.id,
                    movieName: movie.title,
                    movieImage: movie.imageUrl,
                });
                toast.success("Movie added to favorites successfully!");
            } else {
                setIsFavorite(true);
                toast.error("This movie is already in your favorites.");
            }
        } catch (error) {
            console.error("Error adding movie to favorites: ", error);
        }
    }

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            if (!movie || !currentUser) return;
    
            try {
                const favoritesCollectionRef = collection(firestore, "users", currentUser.uid, "favorites");
                const q = query(favoritesCollectionRef, where("movieName", "==", movie.title));
                const querySnapshot = await getDocs(q);
    
                setIsFavorite(!querySnapshot.empty); 
            } catch (error) {
                console.error("Error fetching favorite status: ", error);
            }
        };
    
        fetchFavoriteStatus();
    }, [currentUser, movie]);

    if (!movie) {
        return <p>Loading...</p>;
    }


    console.log(isFavorite);

    const redicertRate = () => {
        navigate(`/rate/${id}`);
    };

    return (
        <div>
            <Navbar />
            {movie && (
                <div className="movieDetailSection container-fluid">
                    <div className="d-flex">
                        <div
                            className="trailer-section container-fluid"
                            id="trailerSection"
                            onClick={closeTrailer}
                            style={{ display: "none" }}
                        >
                            <div className="embed-responsive embed-responsive-16by9 trailer-embed text-center">
                                <iframe
                                    width="840"
                                    height="480"
                                    src={movie.trailer}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                        <section className="movie-desc2">
                            <h2 style={{ color: "#55c1ff" }}>
                                {movie.title}{" "}
                               
                            </h2>
                            <p style={{ fontWeight: "300" }}>
                                {movie.description}
                            </p>
                            <p style={{ fontWeight: "300" }}>
                                <i className="bi bi-clock-fill"></i> &nbsp;{" "}
                                {movie.duration}
                            </p>
                            <p style={{ fontWeight: "300" }}>
                                <i className="bi bi-camera-reels-fill"></i>{" "}
                                &nbsp; {movie.type}
                            </p>
                            <p style={{ fontWeight: "300" }}>
                                <i className="bi bi-people-fill"></i>&nbsp;{" "}
                                {movie.cast}
                            </p>
                            <p style={{ fontWeight: "300", cursor: "pointer" }}>
                                <i className="bi bi-translate"></i>&nbsp;{" "}
                                {movie.languages}
                            </p>
                            <p>
                                <MdFamilyRestroom />
                                &nbsp; {movie.agelimit}
                            </p>
                            <p
                                style={{ fontWeight: "300", cursor: "pointer" }}
                                onClick={redicertRate}
                            >
                                <i className="bi bi-star-half"></i>&nbsp;{" "}
                                {ratingMovie}
                            </p>
                            <button
                                className="btn btn-dark buyTicketBtn"
                                onClick={handleBuyTicket}
                            >
                                Buy Ticket
                            </button>
                            <button
                                className="btn btn-dark trailer-button"
                                onClick={handleTrailer}
                            >
                                <i className="bi bi-play-circle-fill"></i> Watch
                                Trailer
                            </button>
                            <button
                                     className={`btn favorite-button ${isFavorite ? "favorite-active" : "favorite-inactive"}`}
                                    onClick={()=>addFavorites()}
                                >
                                    <MdOutlineFavorite></MdOutlineFavorite>
                                </button>
                        </section>
                        <section className="others-section">
                            <h5
                                style={{
                                    color: "#55c1ff",
                                    marginBottom: "1rem",
                                }}
                            >
                                <i class="bi bi-collection-play"></i>&nbsp; Now
                                playing
                            </h5>
                            <Slider {...settings}>
                                {movies.map((movie) => (
                                    <div className="card-slide" key={movie.id}>
                                        <CardOthers
                                            title={movie.title}
                                            desc={movie.description}
                                            img={movie.imageUrl}
                                            movieId={movie.id}
                                            type={movie.type}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </section>
                        <img
                            src={movie.highImageUrl}
                            alt={movie.title}
                            className="highQualityImg mb-5"
                            style={{
                                display: "block",
                                objectPosition: "1rem 2rem",
                            }}
                        />
                    </div>
                </div>
            )}
             <Toaster
                position="top-center"
                reverseOrder={true}
            />
        </div>
    );
};

export default MovieDetail;
