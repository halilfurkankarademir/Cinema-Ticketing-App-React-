import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import AdminNav from '../AdminNav';
import { firestore, doc, setDoc, arrayUnion } from "../../../firebase/firebase";
import './AddTheater.css';

const AddSeatForm = () => {
    const [theaterNo, setTheaterNo] = useState("");
    const [seatNumber, setSeatNumber] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!theaterNo || !seatNumber) {
            toast.error("Please fill in all required fields!");
            return;
        }

        const newSeat = { number: seatNumber, isReserved: false };

        try {
            const theaterDocRef = doc(firestore, "theaters", theaterNo);

            await setDoc(theaterDocRef, {
                seats: arrayUnion(newSeat)
            }, { merge: true });

            toast.success("Seat added successfully!");
            setTheaterNo("");
            setSeatNumber("");
        } catch (error) {
            console.error("Error adding seat: ", error);
            toast.error("Error adding seat!");
        }
    };

    return (
        <div>
            <div className="addTheaterAll">
                <Toaster position="top-center" />
                <AdminNav />
                <div className="form-container bg-dark text-white addSeatForm">
                    <h2 style={{ color: "#0095FF" }}>Add a New Seat</h2>
                    <form onSubmit={handleSubmit} className="seat-form">
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
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddSeatForm;
