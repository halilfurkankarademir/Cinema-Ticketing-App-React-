import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { Wheel } from "react-custom-roulette";

const WheelSpin = () => {
    const data = [
        {
            option: "Free Movie Ticket",
            style: { backgroundColor: "green", textColor: "black", fontSize:'15' },
        },

        {
            option: "10% Discount",
            style: { backgroundColor: "white", textColor: "black",fontSize:'15' },
        },
        {
            option: "Snack Combo",
            style: { backgroundColor: "gray", textColor: "black" ,fontSize:'15'},
        },
        {
            option: "25% Discount",
            style: { backgroundColor: "white", textColor: "black" ,fontSize:'15'},
        },
        {
            option: "Movie Merchandise",
            style: { backgroundColor: "gray", textColor: "black",fontSize:'15' },
        },
        {
            option: "50% Discount",
            style: { backgroundColor: "white", textColor: "black",fontSize:'15' },
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
            <div className="container-fluid">
                <button className="btn btn-dark" onClick={startSpin}>Start Spin</button>
                <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={data}
                    backgroundColors={["#3e3e3e", "#df3428"]}
                    textColors={["#ffffff"]}
                    onStopSpinning={() => setMustSpin(false)}
                />
            </div>
        </div>
    );
};

export default WheelSpin;
