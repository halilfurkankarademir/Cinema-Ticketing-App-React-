import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Card.css";

const Card = ({ title, desc, img, movieId, date }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="card" onClick={handleClick}>
            <img src={img} className="card-img-top" alt={title} />
            <div className="card-body">
                <p className='viewMovie'>View Movie</p>
                <h5 className="card-title">{title}</h5>
                <h6 className='vision-date' style={{fontSize:'0.8rem'}}><i class="bi bi-calendar-date"></i> {date}</h6>
            </div>
        </div>
    );
};

export default Card;
