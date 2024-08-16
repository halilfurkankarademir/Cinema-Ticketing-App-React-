import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Card.css";

const Card = ({ title, img, date,type }) => {
    const navigate = useNavigate();


    return (
        <div className="card comingCard">
            <img src={img} className="card-img-top" alt={title} />
            <div className="card-body">
                <p className="card-title" style={{fontWeight:'600'}}>{title}</p>
                <h6 className='vision-date' style={{fontSize:'0.8rem', fontWeight:'400'}}><i className="bi bi-calendar-date"></i> {date}</h6>
                <h6 className='vision-date' style={{fontSize:'0.8rem',fontWeight:'400'}}>{type}</h6>
                
            </div>
        </div>
    );
};

export default Card;
