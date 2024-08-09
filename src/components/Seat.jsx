import React from 'react';
import './Seat.css'

const Seat = ({ seatNumber, isReserved, isSelected, onSeatClick }) => {
  return (
    <div
      style={{
        margin: '5px',
        width: '30px',
        height: '30px',
        color : isReserved ? 'whitesmoke' : '#121212',
        backgroundColor: isReserved ? '#FF007A' : isSelected ? '#0095FF' : '#9B9B9B',
        cursor: isReserved ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius:'5px',
        marginBlock:'1rem'
      }}
      onClick={() => !isReserved && onSeatClick(seatNumber)}
      className='container seatDesign'
    >
      
      {seatNumber}
    </div>
  );
};

export default Seat;
