import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Card.css";

const Card = ({ title, img, movieId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="card-container text-center" onClick={handleClick} style={{height:'40vh', cursor:'pointer'}}>
            <img src={img} className="image-card" alt={title} style={{width:'100%', height:'80%', borderRadius:'.5rem'}} />
            <p style={{marginTop: '1rem'}}>{title}</p>
        </div>
    );
};

export default Card;
