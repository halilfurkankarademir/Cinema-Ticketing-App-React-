import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";
import { firestore, collection, getDocs } from "../firebase/firebase";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetail.css";

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
                <div>
                    <h1
                        style={{ fontSize: "1.5rem" }}
                        className="movie-title d-flex"
                    >
                        {movie.title}
                        &emsp; &emsp; 
                        <i
                            className="bi bi-heart-fill"
                            onClick={redicertRate}
                        >{` ${ratingMovie}`}</i>
                    </h1>
                    <div className="movie-detail">
                        <img
                            src={movie.imageUrl}
                            alt={movie.title}
                            className="movie-image"
                        />
                        <section className="movie-desc">
                            <h5 style={{ color: "#a682ff"}}>Description</h5>
                            <p style={{ fontWeight: "300", }}>
                                {movie.description}
                            </p>
                            <h5 style={{ color: "#a682ff" }}>Duration</h5>
                            <p style={{ fontWeight: "300" }}>
                                {movie.duration}
                            </p>
                            <h5 style={{ color: "#a682ff" }}>Starring</h5>
                            <p style={{ fontWeight: "300" }}>{movie.cast}</p>
                            <h5 style={{ color: "#a682ff" }}>Type</h5>
                            <p style={{ fontWeight: "300" }}>{movie.type}</p>
                            <h5 style={{ color: "#a682ff" }}>Release Date</h5>
                            <p style={{ fontWeight: "300" }}>{movie.date}</p>
            
                        </section>
                        <div className="embed-responsive embed-responsive-16by9 trailer-embed">
                            <iframe
                                width="420"
                                height="240"
                                src={movie.trailer}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <button
                            type="button"
                            className="movie-buy-ticket"
                            onClick={handleBuyTicket}
                        >
                            Buy Ticket
                        </button>
                    </div>
                </div>
            )}
            <Toaster position="top-center"></Toaster>
        </div>
    );
};

export default MovieDetail;
