import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import toast, { Toaster } from 'react-hot-toast';
import { firestore, collection, getDocs } from "../firebase/firebase";
import { useParams, useNavigate } from "react-router-dom";
import "./MovieDetail.css";

const MovieDetail = () => {
    const [movie, setMovie] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const moviesCollection = collection(firestore, "movies");
                const movieSnapshot = await getDocs(moviesCollection);
                const movieList = movieSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const selectedMovie = movieList.find(
                    (movie) => movie.id === id
                );
                setMovie(selectedMovie);

                if (selectedMovie && selectedMovie.seances) {
                    setSessions(selectedMovie.seances);
                }
            } catch (error) {
                console.error("Error fetching movie: ", error);
            }
        };

        fetchMovie();
    }, [id]);

    const handleSessionChange = (event) => {
        setSelectedSession(event.target.value);
    };

    const handleBuyTicket = () => {
        if (selectedSession) {
            console.log("Navigating to:", `/select-seat/${id}`, {
                state: { movieName: movie.title, showTime: selectedSession },
            });
            navigate(`/select-seat/${id}`, {
                state: { movieName: movie.title, showTime: selectedSession },
            });
        } else {
            toast.error("Please select a session");
        }
    };
    
    if (!movie) {
        return <p>Loading...</p>;
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
                        <h5>Description</h5>
                        <p>{movie.description}</p>
                        <h5>Seances</h5>
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
                    </section>
                    <div class="embed-responsive embed-responsive-16by9 trailer-embed">
                        <iframe
                            width="560"
                            height="315"
                            src={movie.trailer}
                            title="YouTube video player"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerpolicy="strict-origin-when-cross-origin"
                            allowfullscreen
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
