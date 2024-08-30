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
    const { currentUser, userLoggedIn , isAdmin} = useAuth();
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

    const deleteMovie = async (id, isUpcoming = false) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this movie?");
        if (!isConfirmed) return;
    
        try {
            const collectionName = isUpcoming ? "upcoming" : "movies";
            await deleteDoc(doc(firestore, collectionName, id));
            if (isUpcoming) {
                setUpcomingMovies(upcomingMovies.filter((movie) => movie.id !== id));
            } else {
                setMovies(movies.filter((movie) => movie.id !== id));
            }
            toast.success("Movie Deleted!");
        } catch (error) {
            toast.error("Error deleting movie: " + error.message);
        }
    };

    if (!userLoggedIn || !isAdmin) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <AdminNav></AdminNav>
            <br />
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
                                <th scope="col" style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Title</th>
                                <th scope="col" style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Description</th>
                                <th scope="col" style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Seances</th>
                                <th scope="col" style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Image</th>
                                <th scope="col" style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Duration</th>
                                <th scope="col" style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Cast</th>
                                <th scope="col" style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Type</th>
                                <th scope="col" style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Date</th>
                                <th scope="col" style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map((movie) => (
                                <tr key={movie.id}>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>{movie.title}</td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>{movie.description}</td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>{movie.seances.join(", ")}</td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>
                                        <img
                                            src={movie.imageUrl}
                                            alt={movie.title}
                                            className="movie-image"
                                        />
                                    </td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>{movie.duration}</td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>{movie.cast}</td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>{movie.type}</td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>{movie.date}</td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>
                                        <button className="btn btn-danger mb-4" onClick={()=>deleteMovie(movie.id)}>Delete</button>
                                        <Link to={`/edit-movie/${movie.id}`}><button className="btn btn-dark" style={{width:'4.7rem'}}>Edit</button></Link>
                                    </td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <br /> <br /> <br /> <br />
                <div className="container-fluid secondSectionManageMovies">
                    <h3>Upcoming Movies</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col"  style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Title</th>
                                <th scope="col"  style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Image</th>
                                <th scope="col"  style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Type</th>
                                <th scope="col"  style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Date</th>
                                <th scope="col"  style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingMovies.map((movie) => (
                                <tr key={movie.id}>
                                    <td className="text-white" style={{backgroundColor:'#171a1d'}}>{movie.title}</td>
                                    <td className="text-white" style={{backgroundColor:'#171a1d'}}>
                                        <img
                                            src={movie.imageUrl}
                                            alt={movie.title}
                                            className="movie-image"
                                            style={{
                                                width:'100px'
                                            }}
                                        />
                                    </td>
                                    <td className="text-white" style={{backgroundColor:'#171a1d'}}>{movie.type}</td>
                                    <td className="text-white" style={{backgroundColor:'#171a1d'}}>{movie.date}</td>
                                    <td className="text-white" style={{backgroundColor:'#171a1d'}}>
                                        <button className="btn btn-danger" onClick={()=>deleteMovie(movie.id ,true)}>Delete</button>
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
