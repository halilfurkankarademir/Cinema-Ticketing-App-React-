import React, { useState } from "react";
import AdminNav from "./AdminNav";
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
    const [highImage, setHighImage] = useState('');
    const [duration, setDuration] = useState('');
    const [cast, setCast] = useState('');
    const [languages, setLanguages] = useState('');
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
                highImageUrl: highImage,
                duration,
                cast,
                type,
                languages,
                date,
                trailer,
                createdAt: new Date()
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
            setLanguages('');
            setHighImage('');
        } catch (e) {
            console.error("Error adding document: ", e);
            toast.error('Failed to add movie');
        }
    };

    if (!userLoggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <>
        <AdminNav></AdminNav>
        <br /> <br /> <br /> <br /> <br /> <br />
        <div className="addMovie-panel">  
            <Toaster position="top-center"></Toaster>
            <div className="form-container bg-dark text-white addMovieForm">
                <h2 style={{color:'#0095FF'}}>Add Movie</h2>
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
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                            className="bg-dark text-white border-0 "
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="image">High Quality Photo URL:</label>
                        <input
                            id="image"
                            type="text"
                            value={highImage}
                            onChange={(e) => setHighImage(e.target.value)}
                            className="bg-dark text-white border-0 "
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="seance">Sessions (split with ,):</label>
                        <input
                            id="seance"
                            type="text"
                            value={seance}
                            onChange={(e) => setSeance(e.target.value)}
                            className="bg-dark text-white border-0"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="duration">Duration:</label>
                        <input
                            id="duration"
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="bg-dark text-white border-0"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cast">Cast:</label>
                        <input
                            id="cast"
                            type="text"
                            value={cast}
                            onChange={(e) => setCast(e.target.value)}
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
                        <label htmlFor="type">Languages:</label>
                        <input
                            id="type"
                            type="text"
                            value={languages}
                            onChange={(e) => setLanguages(e.target.value)}
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
                            style={{colorScheme:'dark'}}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="trailer">Trailer Embed URL:</label>
                        <input
                            id="trailer"
                            type="text"
                            value={trailer}
                            onChange={(e) => setTrailer(e.target.value)}
                            className="bg-dark text-white border-0"
                        />
                    </div>
                    <button type="submit" className="btn btn-dark">Add Movie</button>
                </form>
            </div>
        </div>
        </>
    );
};

export default AdminPanel;
