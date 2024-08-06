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
import "./ManageRes.css"

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
            <div className="admin-panel">
                <Toaster position="top-center"></Toaster>
                <div className="container-fluid secondSection">
                    <h3>Reservations</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Movie Title</th>
                                <th scope="col">User</th>
                                <th scope="col">Seats</th>
                                <th scope="col">Show Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td>{reservation.movieName}</td>
                                    <td>{reservation.name}</td>
                                    <td>{reservation.seats.join(", ")}</td>
                                    <td>{reservation.showTime}</td>
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
