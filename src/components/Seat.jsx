import React from 'react';
import './Seat.css';

const Seat = ({ seatNumber, isReserved, isSelected, onSeatClick }) => {
  return (
    <div
      onClick={() => !isReserved && onSeatClick(seatNumber)}
      className={`seatDesign ${isReserved ? 'reserved' : isSelected ? 'selected' : 'available'}`}
    >
      {/* {seatNumber} */}
    </div>
  );
};

export default Seat;
