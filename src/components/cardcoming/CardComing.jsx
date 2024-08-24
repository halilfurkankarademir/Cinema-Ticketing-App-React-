import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./CardComing.css";

const Card = ({ title, img, movieId, date, type, trailer, openModal }) => {
    const navigate = useNavigate();

    console.log(trailer);

    return (
        <div className="card comingCard">
            <img src={img} className="card-img-top" alt={title} onClick={()=>openModal(trailer)}/>
            <div className="card-body">
                <p className='coming-trailer' onClick={()=>openModal(trailer)}><i class="bi bi-play-circle"></i> Watch Trailer</p>
                <p className="card-title" style={{fontWeight:'600'}}>{title}</p>
                <h6 className='vision-date' style={{fontSize:'0.8rem', fontWeight:'400'}}><i className="bi bi-calendar-date"></i> {date}</h6>
                <h6 className='vision-date' style={{fontSize:'0.8rem',fontWeight:'400'}}>{type}</h6>
                
            </div>
        </div>
    );
};

export default Card;
