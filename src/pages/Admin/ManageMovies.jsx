import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { doSignOut } from "../../firebase/auth";
import {
    firestore,
    collection,
    getDocs,
    deleteDoc,
    doc,
} from "../../firebase/firebase";
import toast, { Toaster } from "react-hot-toast";
import AdminNav from "./AdminNav";
import "./ManageMovies.css";

const AdminPanel = () => {
    const { currentUser, userLoggedIn } = useAuth();
    const [movies, setMovies] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoggedIn) {
            navigate("/login");
        } else {
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
                    setUpcomingMovies(upcomingMovieList);
                } catch (error) {
                    console.error("Error fetching upcoming movies: ", error);
                }
            };

            document.title = "CineWave | Manage Movies";
            fetchMovies();
            fetchUpcomingMovies();
        }
    }, [userLoggedIn, navigate]);

    function signOut() {
        doSignOut();
        navigate("/");
    }

    const deleteMovie = async (id, isUpcoming) => {
        try {
            const collectionName = isUpcoming ? "upcoming" : "movies";
            await deleteDoc(doc(firestore, collectionName, id));
            if (isUpcoming) {
                setUpcomingMovies(
                    upcomingMovies.filter((movie) => movie.id !== id)
                );
            } else {
                setMovies(movies.filter((movie) => movie.id !== id));
            }
            toast.error("Movie Deleted!");
        } catch (error) {
            console.error("Error deleting movie: ", error);
        }
    };

    if (!userLoggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <AdminNav></AdminNav>
            <div className="admin-panel">
                <Toaster position="top-center"></Toaster>
                <button onClick={signOut} className="sign-out-button">
                    Sign Out
                </button>
                <Link to="/admin/addmovie">
                    <button className="add-movie-button">Add New Movie</button>
                </Link>
                <Link to="/admin/upcoming">
                    <button className="add-movie-button upcoming-button">
                        Add Upcoming Movie
                    </button>
                </Link>
                <div className="container-fluid secondSection">
                    <h3>Manage Movies</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Description</th>
                                <th scope="col">Seances</th>
                                <th scope="col">Image</th>
                                <th scope="col">Duration</th>
                                <th scope="col">Cast</th>
                                <th scope="col">Type</th>
                                <th scope="col">Date</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map((movie) => (
                                <tr key={movie.id}>
                                    <td>{movie.title}</td>
                                    <td>{movie.description}</td>
                                    <td>{movie.seances.join(", ")}</td>
                                    <td>
                                        <img
                                            src={movie.imageUrl}
                                            alt={movie.title}
                                            className="movie-image"
                                        />
                                    </td>
                                    <td>{movie.duration}</td>
                                    <td>{movie.cast}</td>
                                    <td>{movie.type}</td>
                                    <td>{movie.date}</td>
                                    <td>
                                        <i
                                            className="bi bi-trash"
                                            onClick={() =>
                                                deleteMovie(movie.id, false)
                                            }
                                        ></i>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="container-fluid secondSection">
                    <h3>Upcoming Movies</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Title</th>
                                <th scope="col">Description</th>
                                <th scope="col">Seances</th>
                                <th scope="col">Image</th>
                                <th scope="col">Duration</th>
                                <th scope="col">Cast</th>
                                <th scope="col">Type</th>
                                <th scope="col">Date</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingMovies.map((movie) => (
                                <tr key={movie.id}>
                                    <td>{movie.title}</td>
                                    <td>{movie.description}</td>
                                    <td>{movie.seances.join(", ")}</td>
                                    <td>
                                        <img
                                            src={movie.imageUrl}
                                            alt={movie.title}
                                            className="movie-image"
                                        />
                                    </td>
                                    <td>{movie.duration}</td>
                                    <td>{movie.cast}</td>
                                    <td>{movie.type}</td>
                                    <td>{movie.date}</td>
                                    <td>
                                        <i
                                            className="bi bi-trash"
                                            onClick={() =>
                                                deleteMovie(movie.id, true)
                                            }
                                        ></i>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
