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
                                <th scope="col" className="bg-dark" style={{color:'#0095FF'}}>Name</th>
                                <th scope="col" className="bg-dark" style={{color:'#0095FF'}}>Movie</th>
                                <th scope="col" className="bg-dark" style={{color:'#0095FF'}}>Seats</th>
                                <th scope="col" className="bg-dark" style={{color:'#0095FF'}}>Show Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((reservation) => (
                                <tr key={reservation.id}>
                                    <td className="bg-dark text-white">{reservation.name}</td>
                                    <td className="bg-dark text-white">{reservation.movieName}</td>
                                    <td className="bg-dark text-white">{reservation.seats.join(", ")}</td>
                                    <td className="bg-dark text-white">{reservation.showTime}</td>
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
