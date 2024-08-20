import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../footer/Footer";
import "./RateMovie.css";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import { useParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";

const RateMovie = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]); 

    document.title = "CineWave | Rate"

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

        const fetchComments = async () => {
            try {
                const commentsCollection = collection(firestore, "ratings");
                const commentSnapshot = await getDocs(commentsCollection);
                const commentList = commentSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log("Comment List:", commentList);

                
                const selectedMovieComments = commentList.filter(
                    (comment) => comment.movieId === id 
                );

                setComments(selectedMovieComments); 
                
            } catch (error) {
                console.error("Error fetching comments: ", error);
            }
        };

        fetchMovie();
        fetchComments();
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
            if (comment) {
                const docRef = await addDoc(collection(firestore, 'ratings'), {
                    title: movie.title,
                    rating: rating,
                    comment: comment,
                    movieId: movie.id
                });
                toast.success('Comment added.');
                setComment('');
                setComments([...comments, { id: docRef.id, title: movie.title, rating: rating, comment: comment, movieId: movie.id }]);
            } else {
                toast.error('Comment cannot be empty!');
            }
        } catch (err) {
            toast.error("Comment couldn't add!");
        }
    };

    const renderStars = (rating) =>{
        return(
            <div className="stars">
            {[...Array(5)].map((_, index) => (
                <i
                    key={index}
                    className={index < rating ? "bi bi-star-fill commentstarfill" : "bi bi-star commentstar"}
                ></i>
            ))}
        </div>
        );
    };

    return (
        <div>
            <Toaster position="top-center"></Toaster>
            <Navbar />
            <br /> <br /> <br /> <br /> <br /> 
            <div className="container-fluid rate-section">
                <div className="stars d-flex">
                    {[...Array(5)].map((_, index) => (
                        <i
                            key={index}
                            className="bi bi-star"
                            onClick={() => setStarCount(index + 1)}
                            id={`star${index + 1}`}
                        ></i>
                    ))}
                    {[...Array(5)].map((_, index) => (
                        <i
                            key={index}
                            className="bi bi-star-fill"
                            onClick={() => setStarCount(index + 1)}
                            id={`fillstar${index + 1}`}
                        ></i>
                    ))}
                </div>
                <div className="form-container d-flex flex-column rateForm">
                    <h1 className="text-center">{movie ? movie.title : "..."}</h1>
                    <p>Choose rating.</p>
                    <br />
                    <label htmlFor="comment">Your comment</label>
                    <textarea name="comment" id="textAreaRating" className="form-control mt-2 bg-dark border-0 text-white" 
                    onChange={(e) => setComment(e.target.value)}
                    value={comment}
                    ></textarea>
                    <button type="submit" className="btn btn-dark mt-4" onClick={addComment}>Add rating</button>
                </div>
                <div className="container-fluid d-flex flex-column form-container  commentsForm">
                    <h5 className="text-center">Comments</h5>
                    {comments.length > 0 ? (
                        comments.map((cmt) => (
                            <div key={cmt.id} className="comment mt-3 bg-dark border-0">
                                <div className="ratingstarsposition">
                                    {renderStars(cmt.rating)}
                                </div>
                                <p><strong>Comment:</strong> {cmt.comment}</p>
                            </div>
                        ))
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </div>
             
            </div>
            <Footer />
        </div>
    );
};

export default RateMovie;
