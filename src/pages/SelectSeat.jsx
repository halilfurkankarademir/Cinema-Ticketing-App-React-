import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Seat from "../components/Seat";
import Navbar from "../components/Navbar";
import Footer from "./footer/Footer";
import toast, { Toaster } from "react-hot-toast";
import "./SelectSeat.css";
import { collection, getDocs, query, where,doc,getDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SeatSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { movieName, img } = location.state || {};
    const [seats, setSeats] = useState([]);
    const [reservedSeats, setReservedSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [showTime, setShowTime] = useState("");
    const [formattedDate, setFormattedDate] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [ticketCount, setTicketCount] = useState(0);
    const [sessions, setSessions] = useState([]);
    const currentDate = new Date().toDateString();
    const { id } = useParams();

    useEffect(() => {
        const fetchReservations = async () => {
            if (!movieName || !showTime || !formattedDate) return;

            const resRef = collection(firestore, "reservations");
            const q = query(
                resRef,
                where("movieName", "==", movieName),
                where("showTime", "==", showTime),
                where("date", "==", formattedDate)
            );
            const qSnapshot = await getDocs(q);
            const reserved = [];
            qSnapshot.forEach((doc) => {
                reserved.push(...doc.data().seats);
            });
            setReservedSeats(reserved);
        };
        fetchReservations();
    }, [movieName, showTime, formattedDate]);

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
    }, [id]);

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                
                const theaterDocRef = doc(firestore, "theaters", "1");
                const theaterDoc = await getDoc(theaterDocRef);
        
                if (theaterDoc.exists()) {
                   
                    const theaterData = theaterDoc.data();
                    
                    const theaterSeats = theaterData.seats || [];
                    console.log("Seats:", theaterSeats);
                    setSeats(theaterSeats);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching seats: ", error);
            }
        };
        fetchSeats();
    }, [id, selectedDate, showTime, reservedSeats]);

    useEffect(() => {
        const formatted = selectedDate
            ? new Date(selectedDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
              })
            : "";
        setFormattedDate(formatted);
    }, [selectedDate]);

    const handleSeatClick = (seatNumber) => {
        if (selectedDate !== null && showTime !== "") {
            setSelectedSeats((prevSelectedSeats) => {
                const newSelectedSeats = prevSelectedSeats.includes(seatNumber)
                    ? prevSelectedSeats.filter((seat) => seat !== seatNumber)
                    : [...prevSelectedSeats, seatNumber];
                setTicketCount(newSelectedSeats.length);
                return newSelectedSeats;
            });
        } else {
            toast.error("Select date and session first!");
        }
    };

    const handlePayment = () => {
        if (
            selectedSeats.length > 0 &&
            showTime !== "" &&
            selectedDate !== null
        ) {
            const now = new Date();
            const selectedDateTime = new Date(selectedDate);

            const [hours, minutes] = showTime.split(":").map(Number);
            selectedDateTime.setHours(hours);
            selectedDateTime.setMinutes(minutes);

            if (selectedDateTime < now) {
                toast.error(
                    "Selected time is in the past. Please choose a valid session."
                );
                return;
            }

            navigate("/payment", {
                state: {
                    movieName,
                    showTime,
                    ticketCount,
                    selectedSeats,
                    selectedDate,
                },
            });
        } else {
            toast.error("Please select seat, date, and session.");
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSessionChange = (event) => {
        setShowTime(event.target.value);
    };

    return (
        <div>
            <Navbar />
            <img src={img} alt="" className="highQualityImg2" />
            <div className="container-fluid selectSeatAll">
                <div className="select-date-time container-fluid form-container bg-dark">
                    <h6>Date</h6>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="MMM d, yyyy"
                        className="custom-datepicker"
                        placeholderText="Select"
                        minDate={new Date()}
                    />
                    <h6>Session</h6>
                    <select
                        className="custom-select"
                        onChange={handleSessionChange}
                    >
                        <option value="">Select</option>
                        {sessions.map((session, index) => (
                            <option key={index} value={session}>
                                {session}
                            </option>
                        ))}
                    </select>
                    <h6>Seats</h6>
                    <div className="d-flex justify-content-center">
                        {selectedSeats.length > 0 ? (
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
                            ))
                        ) : (
                            <p style={{ fontWeight: "500", color: "#FF3999" }}>
                                No seat selected yet.
                            </p>
                        )}
                    </div>
                    <h6>Total Fee</h6>
                    <p style={{ fontWeight: "500", color: "#FF3999" }}>
                        ${ticketCount > 0 ? 10 * ticketCount : 0}
                    </p>
                    <button className="buyTicket" onClick={handlePayment}>
                        Continue
                    </button>
                </div>
                <h5>
                    <p
                        style={{ color: "#55c1ff"}}
                        className="titleSelect"
                    >
                        {movieName}
                    </p>
                </h5>
                <br />
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        width: "600px",
                    }}
                    className="seatsAll"
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
                <div className="scene">
                    <p className="pt-3">Scene</p>
                </div>
                <br />

                <div className="container-fluid d-flex seatInfoIcons">
                    <div className="selectedSeat" title="Selected"></div>
                    <p className="selectP">Selected</p>
                    <div className="emptySeat" title="Empty"></div>
                    <p className="emptyP">Empty</p>
                    <div className="reservedSeat" title="Reserved"></div>
                    <p className="reservedP">Reserved</p>
                </div>
            </div>
            <Toaster position="top-center"></Toaster>
            {/* <Footer /> */}
        </div>
    );
};

export default SeatSelection;
