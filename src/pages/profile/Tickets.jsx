import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/auth';
import { firestore, collection, getDocs, query, where,doc,deleteDoc } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './Tickets.css';

const Tickets = () => {
    const { currentUser, userLoggedIn } = useAuth();
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoggedIn) {
            navigate('/login');
        }

        const fetchTickets = async () => {
            if (currentUser) {
                try {
                    const reservationsCollection = collection(firestore, "reservations");
                    const q = query(reservationsCollection, where("email", "==", currentUser.email));
                    const ticketsSnapshot = await getDocs(q);
                    const ticketsList = ticketsSnapshot.docs.map((doc) => {
                        const data = doc.data();
                        return {
                            ...data,
                            id: doc.id,
                            timestamp: data.timestamp,
                        };
                    });

                    setTickets(ticketsList);
                } catch (err) {
                    console.error('Error fetching tickets:', err);
                    toast.error('No tickets found!');
                }
            }
        };

        fetchTickets();
    }, [currentUser, userLoggedIn, navigate]);

    const deleteTicket = async (ticketId, timestamp) => {
        try {
            const now = new Date().getTime();
            if (timestamp > now) {
                const ticketDocRef = doc(firestore, "reservations", ticketId);
                await deleteDoc(ticketDocRef);
                setTickets(tickets.filter(ticket => ticket.id !== ticketId));
                toast.success('Ticket cancelled successfully!');
            } else {
                toast.error('Ticket date expired!');
            }
        } catch (err) {
            console.error('Error deleting ticket:', err);
            toast.error('Error cancelling ticket.');
        }
    };

    return (
        <div>
            <Navbar />
            <div className='container-fluid justify-content-center align-content-center'>
                <div className='table-responsive ticketTable'>
                    <h3>My Tickets</h3>
                    <table className='table table-striped'>
                        <thead>
                            <tr>
                                <th style={{backgroundColor:'transparent',color:'#0095ff'}}>Movie</th>
                                <th style={{backgroundColor:'transparent',color:'#0095ff'}}>Showtime</th>
                                <th style={{backgroundColor:'transparent',color:'#0095ff'}}>Seats</th>
                                <th style={{backgroundColor:'transparent',color:'#0095ff'}}>Date</th>
                                <th style={{backgroundColor:'transparent',color:'#0095ff'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.length > 0 ? (
                                tickets.map((ticket) => (
                                    <tr key={ticket.id}>
                                        <td style={{backgroundColor:'transparent',color:'white'}}>{ticket.movieName}</td>
                                        <td style={{backgroundColor:'transparent',color:'white'}}>{ticket.showTime}</td>
                                        <td style={{backgroundColor:'transparent',color:'white'}}>{ticket.seats.join(", ")}</td>
                                        <td style={{backgroundColor:'transparent',color:'white'}}>{ticket.date}</td>
                                        <td style={{backgroundColor:'transparent',color:'white'}}>
                                            <button 
                                                className='btn btn-danger btn-sm'
                                                onClick={() => deleteTicket(ticket.id, ticket.timestamp)}
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className='text-center bg-transparent text-white p-5'>No tickets available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Toaster
                position="top-center"
                reverseOrder={true}
            />
        </div>
    );
};

export default Tickets;
