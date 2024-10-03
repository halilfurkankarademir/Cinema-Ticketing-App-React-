import React from 'react';
import './Seat.css';

const Seat = ({ seatNumber, isReserved, isSelected, onSeatClick }) => {
  return (
    <div
      onClick={() => !isReserved && onSeatClick(seatNumber)} //Change seat state if is clicked.
      className={`seatDesign ${isReserved ? 'reserved' : isSelected ? 'selected' : 'available'}`}
    >
      <span className='seatNumber'>{seatNumber}</span>
    </div>
  );
};

export default Seat;
