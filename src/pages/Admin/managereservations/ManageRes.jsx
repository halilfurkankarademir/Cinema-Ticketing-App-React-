import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../../context/auth";
import { doSignOut } from "../../../firebase/auth";
import {
    firestore,
    collection,
    getDocs,
    deleteDoc,
    doc,
} from "../../../firebase/firebase";
import toast, { Toaster } from "react-hot-toast";
import AdminNav from "../AdminNav";
import "./ManageRes.css";

const ManageRes = () => {
    const { currentUser, userLoggedIn } = useAuth();
    const [reservations, setReservations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoggedIn) {
            navigate("/login");
        } else {
            const fetchReservations = async () => {
                try {
                    const resCollection = collection(firestore, "reservations");
                    const resSnapshot = await getDocs(resCollection);
                    const resList = resSnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setReservations(resList);
                } catch (error) {
                    console.error("Error fetching reservations: ", error);
                }
            };

            document.title = "CineWave | Manage Reservations";
            fetchReservations();
        }
    }, [userLoggedIn, navigate]);

    const handleDelete = async (reservationId) => {
        try {
            await deleteDoc(doc(firestore, "reservations", reservationId));
            setReservations(reservations.filter((res) => res.id !== reservationId));
            toast.success("Reservation canceled successfully!");
        } catch (error) {
            console.error("Error deleting reservation: ", error);
            toast.error("Failed to cancel reservation.");
        }
    };

    function signOut() {
        doSignOut();
        navigate("/");
    }

    if (!userLoggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <AdminNav></AdminNav>
            <br /> <br /> <br /> <br /> <br /> <br /> <br />
            <div className="admin-panel">
                <Toaster position="top-center"></Toaster>
                <div className="container-fluid secondSectionReservations">
                    <h3>Reservations</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col"  style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Name</th>
                                <th scope="col"  style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Movie</th>
                                <th scope="col"  style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Seats</th>
                                <th scope="col"  style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Date</th>
                                <th scope="col"  style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Show Time</th>
                                <th scope="col"  style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>{reservation.name}</td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>{reservation.movieName}</td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>{reservation.seats.join(", ")}</td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>{reservation.date}</td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>{reservation.showTime}</td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(reservation.id)}
                                        >
                                            Cancel
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageRes;
