import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { firestore, collection, getDocs } from "../firebase/firebase";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetail.css";
import gsap from "gsap";
import Footer from "./footer/Footer";

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
            numberOfRatings > 0 ? (totalRating / numberOfRatings).toString() : "No ratings yet";
        setRatingMovie(averageRating);
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
            scale: 1.3,
            ease: "power4.inOut",
            duration: 2,
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
                        <section className="movie-desc2">
                            
                            <h2 style={{ color: "#55c1ff" }}>{movie.title}</h2>

                            <p style={{ fontWeight: "300" }}>
                                {movie.description}
                            </p>
                            <p style={{ fontWeight: "300" }}>
                            <i className="bi bi-clock-fill"></i> &nbsp; {movie.duration}
                            </p>
                            <p style={{ fontWeight: "300" }}><i className="bi bi-camera-reels-fill"></i> &nbsp; {movie.type}</p>
                            <p style={{ fontWeight: "300" }}><i className="bi bi-people-fill"></i>&nbsp; {movie.cast}</p>
                            <p style={{ fontWeight: "300", cursor:'pointer' }} onClick={redicertRate}><i className="bi bi-star-half"></i>&nbsp; {ratingMovie}</p>
                            <button
                                className="btn btn-dark buyTicketBtn"
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
                            style={{
                                display: "block",
                                objectPosition: "1rem 2rem",
                            }}
                        />
                    </div>
                </div>
            )}
            <Toaster position="top-center"></Toaster>
            <Footer></Footer>
        </div>
    );
};

export default MovieDetail;
