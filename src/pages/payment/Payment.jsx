import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../footer/Footer";
import { firestore, collection, addDoc, doc, setDoc, getDoc, updateDoc, increment } from "../../firebase/firebase";
import "./Payment.css";

const Payment = () => {
    const date = new Date().toDateString();
    const location = useLocation();
    const navigate = useNavigate();
    const [orderNo, setOrderNo] = useState('');
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalSoldTickets, setTotalSoldTickets] = useState(0);

    const { movieId, movieName, showTime, ticketType, ticketCount, auditorium, selectedSeats } =
        location.state || {};

    const calculateTotalPrice = (ticketCount, ticketType) => {
        if (ticketType.toLowerCase() === "adult") {
            return 15 * ticketCount;
        } else {
            return 10 * ticketCount;
        }
    };

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
            await setDoc(docRef, {
                totalRevenue: increment(calculateTotalPrice(ticketCount, ticketType)),
            }, { merge: true });
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
            await setDoc(docRef, {
                totalSoldTicketCount: increment(ticketCount),
            }, { merge: true });
        } catch (e) {
            console.error("Error updating total sold tickets: ", e);
        }
    };

    const handleComplete = async (e) => {
        e.preventDefault(); 

        await updateData(); 
        await updateSoldTicketCount(); 
        await updateTotalSoldTickets(); 

        navigate("/paymentcomplete", {
            state: {
                movieName,
                showTime,
                ticketType,
                ticketCount,
                auditorium,
                orderNo,
                selectedSeats
            },
        });
    };

    const generateOrderNumber = () => {
        const now = new Date();
        const timestamp = now.getTime();
        const randomNum = Math.floor(Math.random() * 1000);
        return `ORD-${timestamp}-${randomNum}`;
    };

    return (
        <div>
            <Navbar />
            <div className="container-fluid payment-container">
                <main>
                    <div className="py-5">
                        <h2>Payment</h2>
                    </div>

                    <div className="row g-5">
                        <div className="col-md-5 col-lg-4 order-md-last ticket-details">
                            <h4 className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text">Ticket Details</span>
                            </h4>
                            <ul className="list-group mb-3 w-100">
                                <li className="list-group-item d-flex justify-content-between lh-sm">
                                    <div>
                                        <h6 className="my-0">Movie Name</h6>
                                        <small className="text-muted">
                                            {movieName}
                                        </small>
                                    </div>
                                </li>
                                <li className="list-group-item d-flex justify-content-between lh-sm">
                                    <div>
                                        <h6 className="my-0">Showtime</h6>
                                        <small className="text-muted">
                                            {`${date} | ${showTime}`}
                                        </small>
                                    </div>
                                </li>
                                <li className="list-group-item d-flex justify-content-between lh-sm">
                                    <div>
                                        <h6 className="my-0">Auditorium</h6>
                                        <small className="text-muted">
                                            {auditorium}
                                        </small>
                                    </div>
                                </li>
                                <li className="list-group-item d-flex justify-content-between lh-sm">
                                    <div>
                                        <h6 className="my-0">Ticket Count</h6>
                                        <small className="text-muted">
                                            {`${ticketCount} x ${ticketType}`}
                                        </small>
                                    </div>
                                </li>
                                <li className="list-group-item d-flex justify-content-between lh-sm">
                                    <div>
                                        <h6 className="my-0">Seats</h6>
                                        <small className="text-muted">
                                            {`${selectedSeats}`}
                                        </small>
                                    </div>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <span>Total (USD)</span>
                                    <b>{`$${calculateTotalPrice(
                                        ticketCount,
                                        ticketType
                                    )}`}</b>
                                </li>
                            </ul>
                        </div>

                        <div className="col-md-7 col-lg-8">
                            <form className="needs-validation" noValidate>
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
                                            className="form-control"
                                            id="firstName"
                                            placeholder=""
                                            required
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
                                            className="form-control"
                                            id="lastName"
                                            placeholder=""
                                            required
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
                                            <span className="text-muted">
                                                (Optional)
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder="you@example.com"
                                        />
                                        <div className="invalid-feedback">
                                            Please enter a valid email address
                                            for shipping updates.
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <label
                                            htmlFor="address"
                                            className="form-label"
                                        >
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="address"
                                            placeholder="1234 Main St"
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Please enter your shipping address.
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
                                            className="form-control"
                                            id="cc-name"
                                            placeholder=""
                                            required
                                        />
                                        <small className="text-muted">
                                            Full name as displayed on card
                                        </small>
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
                                            className="form-control"
                                            id="cc-number"
                                            placeholder=""
                                            required
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
                                            className="form-control"
                                            id="cc-expiration"
                                            placeholder=""
                                            required
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
                                            className="form-control"
                                            id="cc-cvv"
                                            placeholder=""
                                            required
                                        />
                                        <div className="invalid-feedback">
                                            Security code required
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4" />
                                <button
                                    className="w-100 btn btn-dark btn-lg"
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
