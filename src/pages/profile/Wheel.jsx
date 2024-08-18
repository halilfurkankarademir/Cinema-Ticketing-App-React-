import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { Wheel } from "react-custom-roulette";
import './Wheel.css'

const WheelSpin = () => {
    const data = [
        {
            option: "Free Movie Ticket",
            style: { backgroundColor: "#FF007A", textColor: "black", fontSize:'15' },
        },

        {
            option: "10% Discount",
            style: { backgroundColor: "#0095FF", textColor: "black",fontSize:'15' },
        },
        {
            option: "Snack Combo",
            style: { backgroundColor: "#A682FF", textColor: "black" ,fontSize:'15'},
        },
        {
            option: "25% Discount",
            style: { backgroundColor: "#0095FF", textColor: "black" ,fontSize:'15'},
        },
        {
            option: "Movie Merchandise",
            style: { backgroundColor: "#FF007A", textColor: "black",fontSize:'15' },
        },
        {
            option: "50% Discount",
            style: { backgroundColor: "#A682FF", textColor: "black",fontSize:'15' },
        },
        {
            option: "Not this time :(",
            style: { backgroundColor: "#0095FF", textColor: "black",fontSize:'15' },
        },
    ];

    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);

    const startSpin = () => {
        const newPrizeNumber = Math.floor(Math.random() * data.length);
        setPrizeNumber(newPrizeNumber);
        setMustSpin(true);
    };

    return (
        <div> 
            <Navbar />
            <div className="container-fluid spinner-section">
                <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={data}
                    backgroundColors={["#0095FF", "#0095FF"]}
                    textColors={["#ffffff"]}
                    onStopSpinning={() => setMustSpin(false)}
                />
                <button className="btn btn-dark mt-2" onClick={startSpin}>Start Spin</button>
            </div>
        </div>
    );
};

export default WheelSpin;
