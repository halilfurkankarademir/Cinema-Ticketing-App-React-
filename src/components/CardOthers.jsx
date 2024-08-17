import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Card.css";

const Card = ({ title, desc, img, movieId , type}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="card" onClick={handleClick} style={{height:'50vh'}}>
            <img src={img} className="card-img-top" alt={title} />
            <div className="card-body">
                <h3 className="card-title" style={{fontWeight:'600'}} >{title}</h3>
            </div>
        </div>
    );
};

export default Card;
