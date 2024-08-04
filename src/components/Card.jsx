import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Card.css";

const Card = ({ title, desc, img, movieId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="card" onClick={handleClick}>
            <img src={img} className="card-img-top" alt={title} />
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
            </div>
        </div>
    );
};

export default Card;
