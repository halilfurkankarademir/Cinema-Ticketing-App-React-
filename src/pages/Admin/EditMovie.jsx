import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { firestore, doc, getDoc, updateDoc } from "../../firebase/firebase";
import toast, { Toaster } from 'react-hot-toast';
import './EditMovie.css';

const EditMovie = () => {
  const { id } = useParams();  
  const navigate = useNavigate();  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [seance, setSeance] = useState(''); 
  const [image, setImage] = useState('');
  const [duration, setDuration] = useState('');
  const [cast, setCast] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [trailer, setTrailer] = useState('');


  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieDocRef = doc(firestore, "movies", id);
        const movieSnap = await getDoc(movieDocRef);
        if (movieSnap.exists()) {
          const movieData = movieSnap.data();
          setTitle(movieData.title);
          setDescription(movieData.description);
          setSeance(movieData.seances.join(', '));
          setImage(movieData.imageUrl);
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
    const seanceArray = seance.split(',').map(s => s.trim());

    try {
      const movieDocRef = doc(firestore, "movies", id);
      await updateDoc(movieDocRef, {
        title,
        description,
        seances: seanceArray,
        imageUrl: image,
        duration,
        cast,
        type,
        date,
        trailer
      });
      navigate("/admin/manage"); 
    } catch (error) {
      console.error("Error updating movie: ", error);
    }
  };

  return (
    <div className="editMovie-container">
         <Toaster position="top-center"></Toaster>
      <form onSubmit={handleUpdate} className="movie-form addMovieForm">
        <h2>Edit Movie</h2>
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
        <button type="submit" className="btn btn-dark">Update Movie</button>
      </form>
    </div>
  );
};

export default EditMovie;
