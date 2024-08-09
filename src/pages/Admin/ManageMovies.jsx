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
                <Link to="/admin/addmovie" className="btn btn-light btnAddMovie">
                    Add Movie
                </Link>
                <Link to="/admin/upcoming" className="btn btn-light btnAddUpcomingMovie">
                    Add Upcoming Movie
                </Link>
                <div className="container-fluid secondSectionManageMovies">
                    <h3>Manage Movies</h3>
                    <table className="table table-responsive-lg">
                        <thead>
                            <tr>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Title</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Description</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Seances</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Image</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Duration</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Cast</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Type</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Date</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map((movie) => (
                                <tr key={movie.id}>
                                    <td className="bg-dark text-white">{movie.title}</td>
                                    <td className="bg-dark text-white">{movie.description}</td>
                                    <td className="bg-dark text-white">{movie.seances.join(", ")}</td>
                                    <td className="bg-dark text-white">
                                        <img
                                            src={movie.imageUrl}
                                            alt={movie.title}
                                            className="movie-image"
                                        />
                                    </td>
                                    <td className="bg-dark text-white">{movie.duration}</td>
                                    <td className="bg-dark text-white">{movie.cast}</td>
                                    <td className="bg-dark text-white">{movie.type}</td>
                                    <td className="bg-dark text-white">{movie.date}</td>
                                    <td className="bg-dark text-white">
                                        <i
                                            className="bi bi-trash"
                                            onClick={() =>
                                                deleteMovie(movie.id, false)
                                            }
                                        ></i>
                                        <Link to={`/edit-movie/${movie.id}`}><i className="bi bi-pencil-square text-white"></i></Link>
                                    </td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="container-fluid secondSectionManageMovies">
                    <h3>Upcoming Movies</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Title</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Description</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Seances</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Image</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Duration</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Cast</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Type</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Date</th>
                                <th scope="col" className="bg-dark " style={{color:'#0095FF'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingMovies.map((movie) => (
                                <tr key={movie.id}>
                                    <td className="bg-dark text-white">{movie.title}</td>
                                    <td className="bg-dark text-white">{movie.description}</td>
                                    <td className="bg-dark text-white">{movie.seances.join(", ")}</td>
                                    <td className="bg-dark text-white">
                                        <img
                                            src={movie.imageUrl}
                                            alt={movie.title}
                                            className="movie-image"
                                        />
                                    </td>
                                    <td className="bg-dark text-white">{movie.duration}</td>
                                    <td className="bg-dark text-white">{movie.cast}</td>
                                    <td className="bg-dark text-white">{movie.type}</td>
                                    <td className="bg-dark text-white">{movie.date}</td>
                                    <td className="bg-dark text-white">
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
