import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Card.css";

const Card = ({ title, desc, img, movieId , type}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="card" onClick={handleClick}>
            <img src={img} className="card-img-top" alt={title} />
            <div className="card-body">
                <p className='viewMovie'>View Movie</p>
                <h3 className="card-title" >{title}</h3>
                <p>{type}</p>
            </div>
        </div>
    );
};

export default Card;
