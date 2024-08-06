import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../footer/Footer";
import "./RateMovie.css";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { useParams } from "react-router-dom";
import {toast,Toaster} from "react-hot-toast";

const RateMovie = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const ids = [
            "fillstar1",
            "fillstar2",
            "fillstar3",
            "fillstar4",
            "fillstar5",
        ];
        ids.forEach((id, index) => {
            const element = document.getElementById(id);
            if (index < rating) {
                element.style.display = "inline-block";
            } else {
                element.style.display = "none";
            }
        });

        const fetchMovie = async () => {
            try {
                const moviesCollection = collection(firestore, "movies");
                const movieSnapshot = await getDocs(moviesCollection);
                const movieList = movieSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log("Movie List:", movieList);
                const selectedMovie = movieList.find(
                    (movie) => movie.id === id
                );

                if (selectedMovie) {
                    setMovie(selectedMovie);
                } else {
                    console.log("No matching movie found with ID:", id);
                }
            } catch (error) {
                console.error("Error fetching movie: ", error);
            }
        };

        fetchMovie();
    }, [rating, id]);

    const setStarCount = (number) => {
        setRating(number);
    };

    const addComment = async (e) => {
        e.preventDefault();
        
        if (!movie) {
            console.log("No movie selected.");
            return;
        }

        try {
            if(comment){
            const docRef = await addDoc(collection(firestore, 'ratings'), {
                title: movie.title,
                rating: rating,
                comment: comment,
                movieId: movie.id
            });
            toast.success('Comment added.');
        }
            else{
                toast.error('Comment cannot be empty!');
            }
            
        } catch (err) {
            toast.error("Comment couldn't add!");
        }
    };

    return (
        <div>
            <Toaster position="top-center"></Toaster>
            <Navbar />
            <div className="container-fluid rate-section">
                <div className="stars d-flex">
                    {[...Array(5)].map((_, index) => (
                        <i
                            key={index}
                            className="bi bi-star staricon"
                            onClick={() => setStarCount(index + 1)}
                            id={`star${index + 1}`}
                        ></i>
                    ))}
                    {[...Array(5)].map((_, index) => (
                        <i
                            key={index}
                            className="bi bi-star-fill staricon"
                            onClick={() => setStarCount(index + 1)}
                            id={`fillstar${index + 1}`}
                        ></i>
                    ))}
                </div>
                <div className="form-container d-flex flex-column">
                    <h1 className="text-center">{movie ? movie.title : "..."}</h1>
                    <p>Choose rating.</p>
                    <br />
                    <label htmlFor="comment">Your comment</label>
                    <textarea name="comment" id="textAreaRating" className="form-control mt-2" onChange={(e) => setComment(e.target.value)}></textarea>
                    <button type="submit" className="btn btn-dark mt-4" onClick={addComment}>Add rating</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RateMovie;
