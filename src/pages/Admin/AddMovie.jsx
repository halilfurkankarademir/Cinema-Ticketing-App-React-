import React, { useState } from "react";
import { useAuth } from "../../context/auth";
import { doSignOut } from "../../firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { firestore, collection, addDoc } from "../../firebase/firebase";
import toast, { Toaster } from 'react-hot-toast';
import './AddMovie.css';

const AdminPanel = () => {
    const { currentUser, userLoggedIn } = useAuth();
    const navigate = useNavigate();
    document.title = "CineWave | Add Vision Movies";
    

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [seance, setSeance] = useState(''); 
    const [image, setImage] = useState('');
    const [duration, setDuration] = useState('');
    const [cast, setCast] = useState('');
    const [type, setType] = useState('');
    const [date, setDate] = useState('');
    const [trailer, setTrailer] = useState('');

    function signOut() {
        doSignOut();
        navigate('/');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const seanceArray = seance.split(',').map(s => s.trim());

        try {
            const docRef = await addDoc(collection(firestore, "movies"), {
                title,
                description,
                seances: seanceArray,
                imageUrl: image,
                duration,
                cast,
                type,
                date,
                trailer,
                createdAt: new Date(),
                reservedSeats:false,
            });

            toast.success('Movie Added');
            setTitle('');
            setDescription('');
            setImage('');
            setSeance('');
            setDuration('');
            setCast('');
            setType('');
            setDate('');
            setTrailer('');
        } catch (e) {
            console.error("Error adding document: ", e);
            toast.error('Failed to add movie');
        }
    };

    if (!userLoggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="addMovie-panel">
            <Toaster position="top-center"></Toaster>
            <div className="form-container">
                <h2>Add Movie</h2>
                <form onSubmit={handleSubmit} className="movie-form">
                    <div className="form-group">
                        <label htmlFor="title">Movie Title:</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">Photo URL:</label>
                        <input
                            id="image"
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="seance">Sessions (split with ,):</label>
                        <input
                            id="seance"
                            type="text"
                            value={seance}
                            onChange={(e) => setSeance(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="duration">Duration:</label>
                        <input
                            id="duration"
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cast">Cast:</label>
                        <input
                            id="cast"
                            type="text"
                            value={cast}
                            onChange={(e) => setCast(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="type">Type:</label>
                        <input
                            id="type"
                            type="text"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Release Date:</label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="trailer">Trailer Embed URL:</label>
                        <input
                            id="trailer"
                            type="text"
                            value={trailer}
                            onChange={(e) => setTrailer(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-dark">Add Movie</button>
                </form>
            </div>
        </div>
    );
};

export default AdminPanel;
