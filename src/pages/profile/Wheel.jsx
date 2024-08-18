import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { Wheel } from "react-custom-roulette";
import toast, { Toaster } from "react-hot-toast";
import { PiSpinnerBallFill } from "react-icons/pi";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import {
    firestore,
    collection,
    getDocs,
    doc,
    deleteDoc,
} from "../../firebase/firebase";
import "./Wheel.css";

const WheelSpin = () => {
    const data = [
        {
            option: "Free Movie Ticket",
            style: {
                backgroundColor: "#FF007A",
                textColor: "black",
                fontSize: "15",
            },
        },
        {
            option: "10% Discount",
            style: {
                backgroundColor: "#0095FF",
                textColor: "black",
                fontSize: "15",
            },
        },
        {
            option: "Snack Combo",
            style: {
                backgroundColor: "#A682FF",
                textColor: "black",
                fontSize: "15",
            },
        },
        {
            option: "25% Discount",
            style: {
                backgroundColor: "#0095FF",
                textColor: "black",
                fontSize: "15",
            },
        },
        {
            option: "Movie Merchandise",
            style: {
                backgroundColor: "#FF007A",
                textColor: "black",
                fontSize: "15",
            },
        },
        {
            option: "50% Discount",
            style: {
                backgroundColor: "#A682FF",
                textColor: "black",
                fontSize: "15",
            },
        },
        {
            option: "Not this time :(",
            style: {
                backgroundColor: "#0095FF",
                textColor: "black",
                fontSize: "15",
            },
        },
    ];

    const { currentUser, userLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [isAvailable, setIsAvailable] = useState(false);

    useEffect(() => {
        if (!userLoggedIn) {
            navigate("/login");
        }
        const fetchTickets = async () => {
            if (currentUser) {
                try {
                    const ticketsCollection = collection(
                        firestore,
                        "users",
                        currentUser.uid,
                        "tickets"
                    );
                    const ticketsSnapshot = await getDocs(ticketsCollection);
                    const ticketsList = ticketsSnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setTickets(ticketsList);
                    setIsAvailable(ticketsList.length % 5 === 0);
                } catch (err) {
                    console.error("Error fetching tickets:", err);
                    alert("No tickets found!");
                }
            }
        };

        fetchTickets();
    }, [currentUser]);

    

    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);

    const startSpin = () => {
        const newPrizeNumber = Math.floor(Math.random() * data.length);
        setPrizeNumber(newPrizeNumber);
        setMustSpin(true);
    };

    const alertPrize = () => {
        const prize = data[prizeNumber].option;
        if (prize === "Not this time :(") {
            toast.error("You couldn't won any prize :(");
        } else {
            toast.success(`You won: ${prize} !`);
        }

        setMustSpin(false);
    };


    return (
        <div>
            <Navbar />
            <div className="container-fluid spinner-section">
               
                {isAvailable && (
                    <>
                        <h2>
                        <PiSpinnerBallFill></PiSpinnerBallFill> Lucky Spin
                        </h2>
                        <Wheel
                            mustStartSpinning={mustSpin}
                            prizeNumber={prizeNumber}
                            data={data}
                            textColors={["#ffffff"]}
                            onStopSpinning={alertPrize}
                            className="wheel-custom"
                            pointerProps={{
                                style: {
                                    transform: "scale(0.5)",
                                    color: "#0095FF",
                                },
                            }}
                        />
                        <button
                            className="btn btn-dark mt-2"
                            onClick={startSpin}
                        >
                            Start Spin
                        </button>
                    </>
                )}
                {
                    !isAvailable && (
                        <>
                        <h5 style={{fontWeight:'400'}}><i class="bi bi-info-square"></i> You don't have the spin rights right now.</h5>
                        </>
                    )
                }
            </div>
            <Toaster position="top-center" reverseOrder={true} />
        </div>
    );
};

export default WheelSpin;
