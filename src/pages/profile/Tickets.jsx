import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/auth';
import { firestore, collection, getDocs, doc, deleteDoc } from '../../firebase/firebase';
import './Tickets.css';
import { useNavigate } from 'react-router-dom';

const Tickets = () => {
    const { currentUser , userLoggedIn} = useAuth();
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    



    useEffect(() => {
        if(!userLoggedIn){
            navigate('/login');
        }
        const fetchTickets = async () => {
            if (currentUser) {
                try {
                    const ticketsCollection = collection(firestore, "users", currentUser.uid, "tickets");
                    const ticketsSnapshot = await getDocs(ticketsCollection);
                    const ticketsList = ticketsSnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setTickets(ticketsList);
                } catch (err) {
                    console.error('Error fetching tickets:', err);
                    alert('No tickets found!');
                }
            }
        };

        fetchTickets();
    }, [currentUser]);

    const deleteTicket = async (ticketId) => {
        try {
            const ticketDocRef = doc(firestore, "users", currentUser.uid, "tickets", ticketId);
            await deleteDoc(ticketDocRef);
            setTickets(tickets.filter(ticket => ticket.id !== ticketId));
            alert('Ticket cancelled successfully!');
        } catch (err) {
            console.error('Error deleting ticket:', err);
            alert('Error cancelling ticket.');
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
                                                onClick={() => deleteTicket(ticket.id)}
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
        </div>
    );
};

export default Tickets;
