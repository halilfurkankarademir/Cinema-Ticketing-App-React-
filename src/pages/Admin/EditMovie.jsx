import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore, doc, getDoc, updateDoc } from "../../firebase/firebase";
import toast, { Toaster } from "react-hot-toast";
import AdminNav from "./AdminNav";
import "./EditMovie.css";

const EditMovie = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [seance, setSeance] = useState("");
    const [image, setImage] = useState("");
    const [highImg, setHighImg] = useState("");
    const [duration, setDuration] = useState("");
    const [cast, setCast] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");
    const [trailer, setTrailer] = useState("");

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const movieDocRef = doc(firestore, "movies", id);
                const movieSnap = await getDoc(movieDocRef);
                if (movieSnap.exists()) {
                    const movieData = movieSnap.data();
                    setTitle(movieData.title);
                    setDescription(movieData.description);
                    setSeance(movieData.seances.join(", "));
                    setImage(movieData.imageUrl);
                    setHighImg(movieData.HighImageUrl);
                    setDuration(movieData.duration);
                    setCast(movieData.cast);
                    setType(movieData.type);
                    setDate(movieData.date);
                    setTrailer(movieData.trailer);
                }
            } catch (error) {
                console.error("Error fetching movie: ", error);
            }
        };
        fetchMovie();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const seanceArray = seance.split(",").map((s) => s.trim());

        try {
            const movieDocRef = doc(firestore, "movies", id);
            await updateDoc(movieDocRef, {
                title,
                description,
                seances: seanceArray,
                imageUrl: image,
                highImageUrl: highImg,
                duration,
                cast,
                type,
                date,
                trailer,
            });
            navigate("/admin/manage");
        } catch (error) {
            console.error("Error updating movie: ", error);
        }
    };

    return (
        <>
            <AdminNav></AdminNav>
            <div className="editMovie-container">
                <Toaster position="top-center"></Toaster>
                <form
                    onSubmit={handleUpdate}
                    className="edit-movie-form addMovieForm"
                >
                    <h2 style={{ color: "#55C1FF" }}>Edit Movie</h2>
                    <div className="form-group">
                        <label htmlFor="title">Movie Title:</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="bg-dark border-0 text-white"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            className="bg-dark border-0 text-white"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Photo URL:</label>
                        <input
                            id="image"
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="bg-dark border-0 text-white"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">High Quality Photo URL:</label>
                        <input
                            id="image"
                            type="text"
                            value={highImg}
                            onChange={(e) => setHighImg(e.target.value)}
                            className="bg-dark border-0 text-white"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="seance">Sessions (split with ,):</label>
                        <input
                            id="seance"
                            type="text"
                            value={seance}
                            onChange={(e) => setSeance(e.target.value)}
                            className="bg-dark border-0 text-white"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="duration">Duration:</label>
                        <input
                            id="duration"
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="bg-dark border-0 text-white"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cast">Cast:</label>
                        <input
                            id="cast"
                            type="text"
                            value={cast}
                            onChange={(e) => setCast(e.target.value)}
                            className="bg-dark border-0 text-white"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type:</label>
                        <input
                            id="type"
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="bg-dark border-0 text-white"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Release Date:</label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="bg-dark border-0 text-white"
                            style={{ colorScheme: "dark" }}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="trailer">Trailer Embed URL:</label>
                        <input
                            id="trailer"
                            type="text"
                            value={trailer}
                            onChange={(e) => setTrailer(e.target.value)}
                            className="bg-dark border-0 text-white"
                        />
                    </div>
                    <button type="submit" className="btn btn-dark">
                        Update Movie
                    </button>
                </form>
            </div>
        </>
    );
};

export default EditMovie;
