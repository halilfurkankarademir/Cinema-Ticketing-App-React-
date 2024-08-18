import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { Wheel } from "react-custom-roulette";
import toast, { Toaster } from 'react-hot-toast';
import './Wheel.css';

const WheelSpin = () => {
    const data = [
        { option: "Free Movie Ticket", style: { backgroundColor: "#FF007A", textColor: "black", fontSize:'15' } },
        { option: "10% Discount", style: { backgroundColor: "#0095FF", textColor: "black", fontSize:'15' } },
        { option: "Snack Combo", style: { backgroundColor: "#A682FF", textColor: "black", fontSize:'15' } },
        { option: "25% Discount", style: { backgroundColor: "#0095FF", textColor: "black", fontSize:'15' } },
        { option: "Movie Merchandise", style: { backgroundColor: "#FF007A", textColor: "black", fontSize:'15' } },
        { option: "50% Discount", style: { backgroundColor: "#A682FF", textColor: "black", fontSize:'15' } },
        { option: "Not this time :(", style: { backgroundColor: "#0095FF", textColor: "black", fontSize:'15' } },
    ];

    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);

    const startSpin = () => {
        const newPrizeNumber = Math.floor(Math.random() * data.length);
        setPrizeNumber(newPrizeNumber);
        setMustSpin(true);
    };

    const alertPrize = () => {
        const prize = data[prizeNumber].option;
        if(prize ==='Not this time :('){
            toast.error("You couldn't won any prize :(");
        }
        else{
            toast.success(`You won: ${prize} !`);
        }
       
        setMustSpin(false); 
    };

    return (
        <div> 
            <Navbar />
            <div className="container-fluid spinner-section">
                <Wheel
                    spinDuration={1}
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={data}
                    textColors={["#ffffff"]}
                    onStopSpinning={alertPrize}
                    className="wheel-custom"
                    pointerProps={{
                        style: {
                            transform: 'scale(0.7)', 
                            color:'#0095FF',
                        }
                    }}
                />
                <button className="btn btn-dark mt-2" onClick={startSpin}>Start Spin</button>
            </div>
            <Toaster
                position="top-center"
                reverseOrder={true}
            />
        </div>
    );
};

export default WheelSpin;
