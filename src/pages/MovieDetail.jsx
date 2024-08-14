import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { firestore, collection, getDocs } from "../firebase/firebase";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetail.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const MovieDetail = () => {
    const [movie, setMovie] = useState(null);
    const [comments, setComments] = useState([]);
    const [ratingMovie, setRatingMovie] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();

    document.title = "CineWave | Movie Details";

    const avgRating = () => {
        let totalRating = 0;
        let numberOfRatings = comments.length;

        comments.forEach((cmt) => {
            totalRating += cmt.rating;
        });

        const averageRating =
            numberOfRatings > 0 ? totalRating / numberOfRatings : 0;
        setRatingMovie(averageRating.toFixed(2));
    };

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const moviesCollection = collection(firestore, "movies");
                const movieSnapshot = await getDocs(moviesCollection);
                const movieList = movieSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log(movieList.id);

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
        const fetchComments = async () => {
            try {
                const commentsCollection = collection(firestore, "ratings");
                const commentSnapshot = await getDocs(commentsCollection);
                const commentList = commentSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log("Comment List:", commentList);

                const selectedMovieComments = commentList.filter(
                    (comment) => comment.movieId === id
                );

                setComments(selectedMovieComments);
            } catch (error) {
                console.error("Error fetching comments: ", error);
            }
        };
        fetchComments();
        fetchMovie();
        
    }, []);

    useEffect(() => {
        avgRating();
    }, [comments]);

    useEffect(() => {
        gsap.from(".highQualityImg", {
            opacity: 0,
            scale: 1.5,
            ease: "power4.inOut",
            duration: 3,
        });
    }, [movie]);

    const handleBuyTicket = () => {
        navigate(`/select-seat/${id}`, {
            state: {
                movieName: movie.title,
                img: movie.imageUrl,
            },
        });
    };

    if (!movie) {
        return <p>Loading...</p>;
    }

    const redicertRate = () => {
        navigate(`/rate/${id}`);
    };

    return (
        <div>
            <Navbar />
            {movie && (
                <div className="movieDetailSection container-fluid">
                    <div>
                        <div className="movieDetailTitleSection">
                            <h1
                                style={{ fontSize: "2.5rem", zIndex: "1" }}
                                className="movie-title d-flex"
                            >
                                {movie.title}
                                <div className="ratingsIcon">
                                <i
                                    className="bi bi-heart-fill"
                                    onClick={redicertRate}
                                >{` ${ratingMovie}`}</i>
                            </div>
                            </h1>
                           
                        </div>
                        <section className="movie-desc2">
                            <h5>Description</h5>
                            <p style={{ fontWeight: "300" }}>
                                {movie.description}
                            </p>
                            <h5>Duration</h5>
                            <p style={{ fontWeight: "300" }}>
                                {movie.duration}
                            </p>
                            <h5>Type</h5>
                            <p style={{ fontWeight: "300" }}>{movie.type}</p>
                            <h5>Starring</h5>
                            <p style={{ fontWeight: "300" }}>{movie.cast}</p>
                            <button
                                className="btn btn-dark"
                                onClick={handleBuyTicket}
                            >
                                Buy Ticket
                            </button>
                           
                        </section>
                        <div className="embed-responsive embed-responsive-16by9 trailer-embed text-center">
                            <iframe
                                width="1120"
                                height="640"
                                src={movie.trailer}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <img
                            src={movie.highImageUrl}
                            alt={movie.title}
                            className="highQualityImg mb-5"
                            style={{ display: "block", objectPosition: "1rem 2rem"  }}
                        />
                    </div>
                </div>
            )}
            <Toaster position="top-center"></Toaster>
        </div>
    );
};

export default MovieDetail;
