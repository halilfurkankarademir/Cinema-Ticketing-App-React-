import React, { useState } from "react";
import AdminNav from "./AdminNav";
import { useAuth } from "../../context/auth";
import { doSignOut } from "../../firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { firestore, collection, addDoc } from "../../firebase/firebase";
import toast, { Toaster } from "react-hot-toast";
import "./AddMovie.css";

const AdminPanel = () => {
    const { currentUser, userLoggedIn, isAdmin} = useAuth();
    const navigate = useNavigate();
    document.title = "CineWave | Add Upcoming Movies";
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");
    const [trailer,setTrailer] = useState("");

    function signOut() {
        doSignOut();
        navigate("/");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formattedDate = new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });

            await addDoc(collection(firestore, "upcoming"), {
                title: title,
                imageUrl: image,
                type: type,
                date: formattedDate,
                trailerUrl : trailer,
            });
            toast.success("Movie Added");
            setTitle("");
            setImage("");
            setType("");
            setDate("");
            setTrailer("");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    if (!userLoggedIn || !isAdmin) {
        return <Navigate to="/login" />;
    }

    return (
        <>
            <AdminNav></AdminNav>
            <br /> <br /> <br /> <br /> <br /> <br />
            <div className="addMovie-panel">
                <Toaster position="top-center"></Toaster>
                <div className="form-container bg-dark text-white addMovieForm">
                    <h2 style={{ color: "#0095FF" }}>Add Upcoming Movie</h2>
                    <form onSubmit={handleSubmit} className="movie-form">
                        <div className="form-group">
                            <label htmlFor="title">Movie Title:</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="bg-dark text-white border-0"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="image">Photo URL:</label>
                            <input
                                id="image"
                                type="text"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="bg-dark text-white border-0"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="type">Type:</label>
                            <input
                                id="type"
                                type="text"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="bg-dark text-white border-0"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="date">Release Date:</label>
                            <input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-dark text-white border-0"
                                style={{ colorScheme: "dark" }}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="trailer">Trailer:</label>
                            <input
                                type="text"
                                value={trailer}
                                onChange={(e) => setTrailer(e.target.value)}
                                className="bg-dark text-white border-0"
                                style={{ colorScheme: "dark" }}
                            />
                        </div>
                        <button type="submit" className="btn btn-dark">
                            Add Movie
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AdminPanel;
