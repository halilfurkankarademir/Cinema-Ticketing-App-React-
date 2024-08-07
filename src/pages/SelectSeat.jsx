import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Seat from "../components/Seat";
import Navbar from "../components/Navbar";
import Footer from "./footer/Footer";
import toast, { Toaster } from "react-hot-toast";
import "./SelectSeat.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SeatSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { movieName, showTime } = location.state || {};
    const [seats, setSeats] = useState([]);
    const [reservedSeats, setReservedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [ticketType, setTicketType] = useState("");
    const [ticketCount, setTicketCount] = useState(0);
    const [auditorium, setAuditorium] = useState(0);
    const date = new Date().toDateString();

    useEffect(() => {
        const fetchReservations = async () => {
            if (!movieName || !showTime) return;

            const resRef = collection(firestore, "reservations");
            const q = query(
                resRef,
                where("movieName", "==", movieName),
                where("showTime", "==", showTime)
            );
            const qSnapshot = await getDocs(q);
            const reserved = [];
            qSnapshot.forEach((doc) => {
                reserved.push(...doc.data().seats);
            });
            setReservedSeats(reserved);
        };
        var randNo = Math.floor(Math.random() * 10) + 1;
        setAuditorium(randNo);
        fetchReservations();
    }, [movieName, showTime]);

    useEffect(() => {
        const initializeSeats = () => {
            const allSeats = [
                { number: "A1", isReserved: false },
                { number: "A2", isReserved: false },
                { number: "A3", isReserved: false },
                { number: "A4", isReserved: false },
                { number: "A5", isReserved: false },
                { number: "A6", isReserved: false },
                { number: "A7", isReserved: false },
                { number: "A8", isReserved: false },
                { number: "A9", isReserved: false },
                { number: "A10", isReserved: false },
                { number: "A11", isReserved: false },
                { number: "A12", isReserved: false },
                { number: "A13", isReserved: false },
                { number: "A14", isReserved: false },
                { number: "A15", isReserved: false },

                { number: "B1", isReserved: false },
                { number: "B2", isReserved: false },
                { number: "B3", isReserved: false },
                { number: "B4", isReserved: false },
                { number: "B5", isReserved: false },
                { number: "B6", isReserved: false },
                { number: "B7", isReserved: false },
                { number: "B8", isReserved: false },
                { number: "B9", isReserved: false },
                { number: "B10", isReserved: false },
                { number: "B11", isReserved: false },
                { number: "B12", isReserved: false },
                { number: "B13", isReserved: false },
                { number: "B14", isReserved: false },
                { number: "B15", isReserved: false },

                { number: "C1", isReserved: false },
                { number: "C2", isReserved: false },
                { number: "C3", isReserved: false },
                { number: "C4", isReserved: false },
                { number: "C5", isReserved: false },
                { number: "C6", isReserved: false },
                { number: "C7", isReserved: false },
                { number: "C8", isReserved: false },
                { number: "C9", isReserved: false },
                { number: "C10", isReserved: false },
                { number: "C11", isReserved: false },
                { number: "C12", isReserved: false },
                { number: "C13", isReserved: false },
                { number: "C14", isReserved: false },
                { number: "C15", isReserved: false },

                { number: "D1", isReserved: false },
                { number: "D2", isReserved: false },
                { number: "D3", isReserved: false },
                { number: "D4", isReserved: false },
                { number: "D5", isReserved: false },
                { number: "D6", isReserved: false },
                { number: "D7", isReserved: false },
                { number: "D8", isReserved: false },
                { number: "D9", isReserved: false },
                { number: "D10", isReserved: false },
                { number: "D11", isReserved: false },
                { number: "D12", isReserved: false },
                { number: "D13", isReserved: false },
                { number: "D14", isReserved: false },
                { number: "D15", isReserved: false },

                { number: "E1", isReserved: false },
                { number: "E2", isReserved: false },
                { number: "E3", isReserved: false },
                { number: "E4", isReserved: false },
                { number: "E5", isReserved: false },
                { number: "E6", isReserved: false },
                { number: "E7", isReserved: false },
                { number: "E8", isReserved: false },
                { number: "E9", isReserved: false },
                { number: "E10", isReserved: false },
                { number: "E11", isReserved: false },
                { number: "E12", isReserved: false },
                { number: "E13", isReserved: false },
                { number: "E14", isReserved: false },
                { number: "E15", isReserved: false },
            ];

            const updatedSeats = allSeats.map((seat) => {
                if (reservedSeats.includes(seat.number)) {
                    seat.isReserved = true;
                }
                return seat;
            });

            setSeats(updatedSeats);
        };

        initializeSeats();
    }, [reservedSeats]);

    const handleSeatClick = (seatNumber) => {
        setSelectedSeats((prevSelectedSeats) =>
            prevSelectedSeats.includes(seatNumber)
                ? prevSelectedSeats.filter((seat) => seat !== seatNumber)
                : [...prevSelectedSeats, seatNumber]
        );
        setTicketCount(selectedSeats.length + 1);
    };

    const handlePayment = () => {
        if (selectedSeats.length > 0) {
            navigate("/payment", {
                state: {
                    movieName,
                    showTime,
                    ticketType,
                    ticketCount,
                    auditorium,
                    selectedSeats,
                },
            });
        } else {
            toast.error("Please select seat.");
        }
    };

    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid selectSeatAll">
                <div className="select-date-time container-fluid form-container bg-dark">
                    <h5>
                        <p style={{ color: "#55c1ff" }}>{movieName}</p>
                    </h5>
                    <h6>Date</h6>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="MM/dd"
                        className="custom-datepicker"
                        placeholderText="Pick date"
                    />
                    <h6>Session</h6>

                    {/* <div className="selected-seats-container">
                        {selectedSeats.length > 0 ? (
                            selectedSeats.map((seat) => (
                                <div className="selected-seat" key={seat}>
                                    {seat}
                                </div>
                            ))
                        ) : (
                            <p>You didn't select a seat yet.</p>
                        )}
                    </div> */}
                    <button className="buyTicket" onClick={handlePayment}>
                        Continue to Payment
                    </button>
                </div>
                <br />
                {/* <p>Choose Seat</p> */}
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        width: "600px",
                    }}
                >
                    {seats.map((seat) => (
                        <Seat
                            key={seat.number}
                            seatNumber={seat.number}
                            isReserved={seat.isReserved}
                            isSelected={selectedSeats.includes(seat.number)}
                            onSeatClick={() => handleSeatClick(seat.number)}
                        />
                    ))}
                </div>
                <div className="scene"></div>
                <br />
                <p>Scene</p>
                <div className="container-fluid d-flex seatInfoIcons">
                    <div className="selectedSeat" title="Selected"></div>
                    <p>Selected</p>
                    <div className="emptySeat" title="Empty"></div>
                    <p>Empty</p>
                    <div className="reservedSeat" title="Reserved"></div>
                    <p>Reserved</p>
                </div>
            </div>
            <Toaster position="top-center"></Toaster>
            <Footer />
        </div>
    );
};

export default SeatSelection;
