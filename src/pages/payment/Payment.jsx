import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Navbar from "../../components/Navbar";
import Footer from "../footer/Footer";
import {
    firestore,
    collection,
    addDoc,
    doc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    increment,
    query,
    where,
} from "../../firebase/firebase";
import "./Payment.css";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "../../context/auth";

const Payment = () => {
    const { currentUser } = useAuth();
    const date = new Date().toDateString();
    const location = useLocation();
    const navigate = useNavigate();
    const [orderNo, setOrderNo] = useState("");
    const [name, setName] = useState("");
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalSoldTickets, setTotalSoldTickets] = useState(0);
    const [movieId, setMovieId] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [reservedSeats, setReservedSeats] = useState([]);
    const [isReserved,setIsReserved] = useState(false);

    const {
        movieName,
        showTime,
        ticketType,
        ticketCount,
        auditorium,
        selectedSeats,
        selectedDate,
        theaterNo,
    } = location.state || {};

    const formattedDate = selectedDate
        ? new Date(selectedDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : "";

    const calculateTotalPrice = (ticketCount, ticketType) => {
        return 10 * ticketCount;
    };

    const movieRef = collection(firestore, "movies");
    const movieQuery = query(movieRef, where("title", "==", movieName));
    const [movies, loading, error] = useCollectionData(movieQuery, {
        idField: "id",
    });

    useEffect(() => {
        if (!loading && !error && movies) {
            if (movies.length > 0) {
                setMovieId(movies[0].id);
            } else {
                console.log("No movies found.");
            }
        }
    }, [movies, loading, error]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) return;

            try {
                const userDocRef = doc(firestore, "users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setFirstName(data.firstname || "");
                    setLastName(data.lastname || "");
                    setEmail(data.email || "");
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        if (currentUser) {
            fetchUserData();
        }
    }, [currentUser]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
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
                    const data = doc.data();
                    if (data && data.seats) {
                        reserved.push(...data.seats);
                    }
                });
                setReservedSeats(reserved);
            } catch (error) {
                console.error("Error fetching reservations: ", error);
            }
        };
    
        fetchReservations();
    }, [movieName, showTime, formattedDate]);


    useEffect(() => {
        setOrderNo(generateOrderNumber());
        fetchTotalRevenue();
        fetchTotalSoldTickets();
    }, []);

    const fetchTotalRevenue = async () => {
        try {
            const docRef = doc(firestore, "datas", "totalRevenueDocId");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setTotalRevenue(docSnap.data().totalRevenue || 0);
            } else {
                console.log("No such document!");
            }
        } catch (e) {
            console.error("Error fetching document: ", e);
        }
    };

    const fetchTotalSoldTickets = async () => {
        try {
            const docRef = doc(firestore, "datas", "totalSoldTicketsDocId");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setTotalSoldTickets(docSnap.data().totalSoldTicketCount || 0);
            } else {
                console.log("No such document!");
            }
        } catch (e) {
            console.error("Error fetching document: ", e);
        }
    };

    const updateData = async () => {
        try {
            const docRef = doc(firestore, "datas", "totalRevenueDocId");
            await setDoc(
                docRef,
                {
                    totalRevenue: increment(
                        calculateTotalPrice(ticketCount, ticketType)
                    ),
                },
                { merge: true }
            );
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    const updateSoldTicketCount = async () => {
        try {
            const movieRef = doc(firestore, "movies", movieId);
            await updateDoc(movieRef, {
                soldTicketCount: increment(ticketCount),
            });
        } catch (e) {
            console.error("Error updating sold ticket count: ", e);
        }
    };

    const updateTotalSoldTickets = async () => {
        try {
            const docRef = doc(firestore, "datas", "totalSoldTicketsDocId");
            await setDoc(
                docRef,
                {
                    totalSoldTicketCount: increment(ticketCount),
                },
                { merge: true }
            );
        } catch (e) {
            console.error("Error updating total sold tickets: ", e);
        }
    };

    console.log(selectedSeats);

    const handleComplete = async (e) => {
        e.preventDefault();

        const isDuplicateReservation = selectedSeats.every(seat => reservedSeats.includes(seat));

        if(isDuplicateReservation){
            toast.error("This ticket's already sold")
            return;

        }

        const form = e.target.closest("form");
        if (form.checkValidity() === false) {
            e.stopPropagation();
            form.classList.add("was-validated");
            return;
        }

        await updateData();
        await updateSoldTicketCount();
        await updateTotalSoldTickets();
        reserveSeats(
            movieName,
            showTime,
            selectedSeats,
            formattedDate,
            selectedDate.getTime()
        );

        navigate("/paymentcomplete", {
            state: {
                movieName,
                showTime,
                ticketType,
                ticketCount,
                auditorium,
                orderNo,
                selectedSeats,
                firstname,
                lastname,
                formattedDate,
                theaterNo,
            },
        });
    };

    const reserveSeats = async (
        movieName,
        showtime,
        seats,
        date,
        timestamp
    ) => {
        try {
            const seatRef = await addDoc(
                collection(firestore, "reservations"),
                {
                    seats: seats,
                    movieName: movieName,
                    showTime: showtime,
                    name: firstname + " " + lastname,
                    email: email,
                    date: date,
                    timestamp,
                }
            );
        } catch (error) {
            console.error("Error reserving seats: ", error);
        }
    };

    const generateOrderNumber = () => {
        const now = new Date();
        const timestamp = now.getTime();
        const randomNum = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${randomNum}`;
    };

    return (
        <div>
            <Toaster position="top-center"></Toaster>
            <Navbar />
            <br /> <br /> <br /> <br /> <br /> <br />
            <div className="container-fluid payment-container">
                <main>
                    <div className="py-5">
                        <h2 style={{ color: "#55C1FF" }}>
                            Payment&nbsp; <i className="bi bi-credit-card"></i>
                        </h2>
                    </div>

                    <div className="row g-5">
                        <div className="col-md-5 col-lg-4 order-md-last ticket-details">
                            <h4 className="d-flex justify-content-between align-items-center mb-3 ">
                                <span className="text">Ticket Details</span>
                            </h4>
                            <ul className="list-group mb-3 w-100">
                                <li
                                    className="list-group-item d-flex justify-content-between lh-sm bg-dark"
                                    style={{ color: "#0095FF" }}
                                >
                                    <div>
                                        <h6 className="my-0">Movie Name</h6>
                                        <small className="bg-dark">
                                            {movieName}
                                        </small>
                                    </div>
                                </li>
                                <li
                                    className="list-group-item d-flex justify-content-between lh-sm bg-dark"
                                    style={{ color: "#0095FF" }}
                                >
                                    <div>
                                        <h6 className="my-0">Showtime</h6>
                                        <small className="bg-dark text-white">
                                            {`${formattedDate} | ${showTime}`}
                                        </small>
                                    </div>
                                </li>
                                <li
                                    className="list-group-item d-flex justify-content-between lh-sm bg-dark"
                                    style={{ color: "#0095FF" }}
                                >
                                    <div>
                                        <h6 className="my-0">Theater Number</h6>
                                        <small className="">
                                            {`${theaterNo}`}
                                        </small>
                                    </div>
                                </li>
                                <li
                                    className="list-group-item d-flex justify-content-between lh-sm bg-dark"
                                    style={{ color: "#0095FF" }}
                                >
                                    <div>
                                        <h6 className="my-0">Seats</h6>
                                        <small className="">
                                            {`${selectedSeats}`}
                                        </small>
                                    </div>
                                </li>
                                <li
                                    className="list-group-item d-flex justify-content-between bg-dark "
                                    style={{ color: "#0095FF" }}
                                >
                                    <span>Total (USD)</span>
                                    <b>{`$${calculateTotalPrice(
                                        ticketCount,
                                        ticketType
                                    )}`}</b>
                                </li>
                            </ul>
                        </div>

                        <div className="col-md-7 col-lg-8">
                            <form className="needs-validation">
                                <div className="row g-3">
                                    <div className="col-sm-6">
                                        <label
                                            htmlFor="firstName"
                                            className="form-label"
                                        >
                                            First name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-0"
                                            id="firstName"
                                            placeholder=""
                                            value={firstname}
                                            required
                                            onChange={(e) =>
                                                setFirstName(e.target.value)
                                            }
                                        />
                                        <div className="invalid-feedback">
                                            Valid first name is required.
                                        </div>
                                    </div>

                                    <div className="col-sm-6">
                                        <label
                                            htmlFor="lastName"
                                            className="form-label"
                                        >
                                            Last name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-0"
                                            id="lastName"
                                            placeholder=""
                                            value={lastname}
                                            required
                                            onChange={(e) =>
                                                setLastName(e.target.value)
                                            }
                                        />
                                        <div className="invalid-feedback">
                                            Valid last name is required.
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label
                                            htmlFor="email"
                                            className="form-label"
                                        >
                                            Email{" "}
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control bg-dark text-white border-0"
                                            id="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            required
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                        <div className="invalid-feedback">
                                            Please enter a valid email address
                                            for shipping updates.
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4" />

                                <div className="row gy-3">
                                    <div className="col-md-6">
                                        <label
                                            htmlFor="cc-name"
                                            className="form-label"
                                        >
                                            Name on card
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-0"
                                            id="cc-name"
                                            placeholder=""
                                        />
                                        <div className="invalid-feedback">
                                            Name on card is required
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label
                                            htmlFor="cc-number"
                                            className="form-label"
                                        >
                                            Credit card number
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-0"
                                            id="cc-number"
                                            placeholder=""
                                        />
                                        <div className="invalid-feedback">
                                            Credit card number is required
                                        </div>
                                    </div>

                                    <div className="col-md-3 exp-date">
                                        <label
                                            htmlFor="cc-expiration"
                                            className="form-label"
                                        >
                                            Expiration
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-0"
                                            id="cc-expiration"
                                            placeholder=""
                                        />
                                        <div className="invalid-feedback">
                                            Expiration date required
                                        </div>
                                    </div>

                                    <div className="col-md-3 cvv">
                                        <label
                                            htmlFor="cc-cvv"
                                            className="form-label"
                                        >
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control bg-dark text-white border-0"
                                            id="cc-cvv"
                                            placeholder=""
                                        />
                                        <div className="invalid-feedback">
                                            Security code required
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4" />
                                <button
                                    className="w-100 btn btn-dark btn-lg .compelete-button"
                                    type="submit"
                                    onClick={handleComplete}
                                >
                                    Continue to checkout
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
};
export default Payment;
