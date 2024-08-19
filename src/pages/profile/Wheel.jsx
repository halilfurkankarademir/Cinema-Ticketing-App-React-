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
    query,
    where,
    addDoc,
    setDoc,
    doc,
    updateDoc,
    increment,
    getDoc
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
    const [coupons, setCoupons] = useState([]);
    const [canSpin, setCanSpin] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [spinCount, setSpinCount] = useState(0);

    useEffect(() => {
        if (!userLoggedIn) {
            navigate("/login");
        }

        const fetchSpinCount = async () => {
            if (currentUser) {
                try {
                    const userDocRef = doc(firestore, "users", currentUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setSpinCount(data.spinCount || 0);
                        setCanSpin(data.canSpin !== false);
                    }
                } catch (err) {
                    console.error("Error fetching spin count:", err);
                }
            }
        };

        const fetchTickets = async () => {
            if (currentUser) {
                try {
                    const reservationsCollection = collection(firestore, "reservations");
                    const q = query(
                        reservationsCollection,
                        where("email", "==", currentUser.email)
                    );
                    const ticketsSnapshot = await getDocs(q);
                    const ticketsList = ticketsSnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setTickets(ticketsList);
                } catch (err) {
                    console.error("Error fetching tickets:", err);
                    alert("No tickets found!");
                }
            }
        };

        fetchSpinCount();
        fetchTickets();
    }, [currentUser, userLoggedIn, navigate]);

    const addCoupon = async (newCoupon) => {
        try {
            await addDoc(
                collection(firestore, "users", currentUser.uid, "coupons"),
                { coupon: newCoupon }
            );

            const userDocRef = doc(firestore, "users", currentUser.uid);
            await setDoc(userDocRef, { canSpin: canSpin }, { merge: true });
        } catch (err) {
            console.error("Error adding coupon:", err);
        }
    };

    const incrementSpinCount = async (userId) => {
        try {
            const userDocRef = doc(firestore, "users", userId);
            await updateDoc(userDocRef, {
                spinCount: increment(1),
            });
            console.log("Spin count incremented successfully.");
        } catch (err) {
            console.error("Error incrementing spin count:", err);
        }
    };

    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);

    const startSpin = async () => {
        if (!canSpin) {
            toast.error("You don't have enough tickets to spin!");
            return;
        }

        const newPrizeNumber = Math.floor(Math.random() * data.length);
        setPrizeNumber(newPrizeNumber);
        setMustSpin(true);
        setCanSpin(false);

        try {
            await incrementSpinCount(currentUser.uid);
        } catch (err) {
            console.error("Error starting spin:", err);
        }
    };

    const alertPrize = () => {
        const prize = data[prizeNumber].option;
        if (prize === "Not this time :(") {
            toast.error("You couldn't win any prize :(");
        } else {
            setCoupons((prev) => [...prev, prize]);
            addCoupon(prize);
            toast.success(`You won: ${prize} !`);
        }
        setMustSpin(false);
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid spinner-section">
                {isAvailable ? (
                    <>
                        <h2>
                            <PiSpinnerBallFill /> Lucky Spin
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
                ) : (
                    <h5 style={{ fontWeight: "400" }}>
                        <i className="bi bi-info-square"></i> You don't have any spin rights at the moment.
                    </h5>
                )}
            </div>
            <Toaster position="top-center" reverseOrder={true} />
        </div>
    );
};

export default WheelSpin;
