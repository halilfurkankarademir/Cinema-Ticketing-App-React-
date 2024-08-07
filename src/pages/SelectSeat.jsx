import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
    const {movieName} = location.state || {};
    const [seats, setSeats] = useState([]);
    const [reservedSeats, setReservedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showTime, setShowTime] = useState("");
    const [ticketCount, setTicketCount] = useState(0);
    const [sessions, setSessions] = useState([]);
    const date = new Date().toDateString();
    const { id } = useParams();

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
        fetchReservations();
    }, [movieName, showTime]);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const moviesCollection = collection(firestore, "movies");
                const movieSnapshot = await getDocs(moviesCollection);
                const movieList = movieSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log("Movie List:", movieList);
                const selectedMovie = movieList.find(
                    (movie) => movie.id === id
                );

                if (selectedMovie) {
                    if (selectedMovie.seances) {
                        setSessions(selectedMovie.seances);
                    }
                } else {
                    console.log("No matching movie found with ID:", id);
                }
            } catch (error) {
                console.error("Error fetching movie: ", error);
            }
        };
        fetchMovie();
    }, [movieName]);

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
                    ticketCount,
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

    const handleSessionChange = (event) => {
        setShowTime(event.target.value);
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
                    <select className="custom-select" onChange={handleSessionChange}>
                        <option value="default">Select</option>
                        {sessions.map((session, index) => (
                            <option key={index} value={session}>
                                {session}
                            </option>
                        ))}
                    </select>
                    <h6>Seats</h6>
                    <div className="d-flex justify-content-center">
                        {selectedSeats.length>0 ?
                            selectedSeats.map((seat, index) => (
                                <p
                                    key={index}
                                    style={{
                                        fontWeight: "500",
                                        color: "#FF3999",
                                    }}
                                >
                                    {`${seat}`}&nbsp;
                                </p>
                            )):(<p style={{fontWeight:'500' , color:'#FF3999'}}>No seat selected yet.</p>)}
                    </div>
                    <h6>Ticket Fee</h6>
                    <p style={{ fontWeight: "500", color: "#FF3999" }}>
                        $10 per person
                    </p>
                    <button className="buyTicket" onClick={handlePayment}>
                        Continue
                    </button>
                </div>
                <br />
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
