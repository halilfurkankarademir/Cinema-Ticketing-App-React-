import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import toast, { Toaster } from 'react-hot-toast';
import { firestore, collection, getDocs } from "../firebase/firebase";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetail.css";

const MovieDetail = () => {
    const [movie, setMovie] = useState(null);
    const [comments,setComments] = useState([]);
    const [ratingMovie,setRatingMovie] = useState(0);
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState("");
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    
    

    const avgRating = () => {
        let totalRating = 0;
        let numberOfRatings = comments.length;

        comments.forEach((cmt) => {
            totalRating += cmt.rating;
        });

        const averageRating = numberOfRatings > 0 ? totalRating / numberOfRatings : 0;
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
                    if (selectedMovie.seances) {
                        setSessions(selectedMovie.seances);
                    }
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
        avgRating();
    }, [id,comments]);

    const handleSessionChange = (event) => {
        setSelectedSession(event.target.value);
    };

    const handleBuyTicket = () => {
        if (selectedSession) {
            navigate(`/select-seat/${id}/${selectedSession}`, {
                state: { movieName: movie.title, showTime: selectedSession },
            });
        } else {
            toast.error("Please select a session");
        }
    };

    if (!movie) {
        return <p>Loading...</p>;
    }

    const redicertRate = () =>{
        navigate(`/rate/${id}`);
    }


    return (
        <div>
            <Navbar />
            {movie && (
                <div className="movie-detail">
                    <h1 style={{ fontSize: "1.5rem" }} className="movie-title">
                        {movie.title}
                    </h1>
                    <img
                        src={movie.imageUrl}
                        alt={movie.title}
                        className="movie-image"
                    />
                    <section className="movie-desc">
                        <div className="ratingDetail">
                            <p><b>{`Rating: ${ratingMovie} | ${comments.length} comments. `}</b></p>
                        </div>
                        <h5>Description</h5>
                        <p>{movie.description}</p>
                        <h5>Sessions</h5>
                        <select
                            value={selectedSession}
                            onChange={handleSessionChange}
                            className="selectionSeances"
                        >
                            <option value="">Select a session</option>
                            {sessions.map((session, index) => (
                                <option key={index} value={session}>
                                    {session}
                                </option>
                            ))}
                        </select>
                        <h5>Duration</h5>
                        <p>{movie.duration}</p>
                        <h5>Cast</h5>
                        <p>{movie.cast}</p>
                        <h5>Type</h5>
                        <p>{movie.type}</p>
                        <h5>Release Date</h5>
                        <p>{movie.date}</p>
                        <button type="button" className="btn btn-dark rate-button" onClick={()=>redicertRate()}>Comments</button>
                    </section>
                    <div className="embed-responsive embed-responsive-16by9 trailer-embed">
                        <iframe
                            width="560"
                            height="315"
                            src={movie.trailer}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <button type="button" className="movie-buy-ticket" onClick={handleBuyTicket}>
                        Buy Ticket
                    </button>
                </div>
            )}
            <Toaster position="top-center"></Toaster>
        </div>
    );
};

export default MovieDetail;
