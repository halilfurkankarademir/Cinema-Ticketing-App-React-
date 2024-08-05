import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../footer/Footer";
import "./RateMovie.css";

const RateMovie = () => {

    const [rating, setRating] = useState(0);

    const [comment,setComment] = useState('');

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
    }, [rating]);

    const setStarCount = (number) => {
        setRating(number);
    };

    console.log(comment);

    return (
        <div>
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
                    <h1 className="text-center">Rating</h1>
                    <p>Choose rating.</p>
                    <br />
                    <label htmlFor="comment">Your comment</label>
                    <textarea name="comment" id="textAreaRating" className="form-control mt-2" onChange={(e)=>setComment(e.target.value)}></textarea>
                    <button type="submit" className="btn btn-dark mt-4">Add rating</button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RateMovie;
