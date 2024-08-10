import React from 'react';
import './Seat.css';

const Seat = ({ seatNumber, isReserved, isSelected, onSeatClick }) => {
  return (
    <div
      onClick={() => !isReserved && onSeatClick(seatNumber)}
      className={`seatDesign ${isReserved ? 'reserved' : isSelected ? 'selected' : 'available'}`}
    >
      <span className='seatNumber'>{seatNumber}</span>
    </div>
  );
};

export default Seat;
