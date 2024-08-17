import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Card.css";

const Card = ({ title, desc, img, movieId , type}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="d-flex justify-content-center align-content-center text-center" onClick={handleClick} style={{height:'40vh'}}>
            <img src={img} className="image-card text-center" alt={title} style={{width:'70%',height:'45vh', cursor:'pointer'}} />
        </div>
    );
};

export default Card;
