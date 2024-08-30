import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import AdminNav from "../AdminNav";
import {
    firestore,
    doc,
    setDoc,
    arrayUnion,
    updateDoc,
    arrayRemove,
    getDoc,
} from "../../../firebase/firebase";
import "./AddTheater.css";

const AddSeatForm = () => {
    const [theaterNo, setTheaterNo] = useState("");
    const [seatNumber, setSeatNumber] = useState("");
    const [seats, setSeats] = useState([]);

    useEffect(() => {
        // Fetch seats for the selected theater
        const fetchSeats = async () => {
            if (theaterNo) {
                const theaterDocRef = doc(firestore, "theaters", theaterNo);
                const docSnapshot = await getDoc(theaterDocRef);

                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    setSeats(data.seats || []);
                } else {
                    setSeats([]);
                }
            }
        };

        fetchSeats();
    }, [theaterNo]);

    const handleAddSeat = async (e) => {
        e.preventDefault();

        if (!theaterNo || !seatNumber) {
            toast.error("Please fill in all required fields!");
            return;
        }

        const newSeat = { number: seatNumber, isReserved: false };

        try {
            const theaterDocRef = doc(firestore, "theaters", theaterNo);

            await setDoc(
                theaterDocRef,
                {
                    seats: arrayUnion(newSeat),
                },
                { merge: true }
            );

            toast.success("Seat added successfully!");
            setSeatNumber("");
            // Refresh seats list after adding
            const docSnapshot = await getDoc(theaterDocRef);
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setSeats(data.seats || []);
            }
        } catch (error) {
            console.error("Error adding seat: ", error);
            toast.error("Error adding seat!");
        }
    };

    const handleDeleteSeat = async () => {
        if (!theaterNo || !seatNumber) {
            toast.error("Please fill in the theater number and seat number!");
            return;
        }

        try {
            const theaterDocRef = doc(firestore, "theaters", theaterNo);

            await updateDoc(theaterDocRef, {
                seats: arrayRemove({ number: seatNumber, isReserved: false }),
            });

            toast.success("Seat removed successfully!");
            setSeatNumber("");
        
            const docSnapshot = await getDoc(theaterDocRef);
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setSeats(data.seats || []);
            }
        } catch (error) {
            console.error("Error removing seat: ", error);
            toast.error("Error removing seat!");
        }
    };

    return (
        <div>
             <Toaster position="top-center" />
            <AdminNav />
            <div className="addTheaterAll">
                <div className="form-container bg-dark text-white addSeatForm">
                    <h2 style={{ color: "#0095FF" }}>Manage Seats</h2>
                    <form onSubmit={handleAddSeat} className="seat-form">
                        <div className="form-group">
                            <label htmlFor="theaterNo">Theater Number:</label>
                            <input
                                id="theaterNo"
                                type="text"
                                value={theaterNo}
                                onChange={(e) => setTheaterNo(e.target.value)}
                                required
                                className="bg-dark text-white border-0"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="seatNumber">Seat Number:</label>
                            <input
                                id="seatNumber"
                                type="text"
                                value={seatNumber}
                                onChange={(e) => setSeatNumber(e.target.value)}
                                required
                                className="bg-dark text-white border-0"
                            />
                        </div>
                        <button type="submit" className="btn btn-dark">
                            Add Seat
                        </button>
                        <button
                            type="button" 
                            onClick={handleDeleteSeat}
                            className="btn btn-danger"
                            style={{marginLeft:'2rem'}}
                        >
                            Delete Seat
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSeatForm;
