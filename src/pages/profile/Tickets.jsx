import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/auth';
import { firestore, collection, getDocs } from '../../firebase/firebase';
import './Tickets.css'; 

const Tickets = () => {
    const { currentUser } = useAuth();
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
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

    return (
        <div>
            <Navbar />
            <div className='container-fluid justify-content-center align-content-center'>
                <div className='table-responsive ticketTable'>
                    <h3>My Tickets</h3>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th style={{backgroundColor:'#171a1d',color:'#0095ff'}}>Movie</th>
                                <th style={{backgroundColor:'#171a1d',color:'#0095ff'}}>Showtime</th>
                                <th style={{backgroundColor:'#171a1d',color:'#0095ff'}}>Seats</th>
                                <th style={{backgroundColor:'#171a1d',color:'#0095ff'}}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.length > 0 ? (
                                tickets.map((ticket) => (
                                    <tr key={ticket.id}>
                                        <td style={{backgroundColor:'#171a1d',color:'white'}}>{ticket.movieName}</td>
                                        <td style={{backgroundColor:'#171a1d',color:'white'}}>{ticket.showTime}</td>
                                        <td style={{backgroundColor:'#171a1d',color:'white'}}>{ticket.seats.join(", ")}</td>
                                        <td style={{backgroundColor:'#171a1d',color:'white'}}>{ticket.date}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className='text-center'>No tickets available.</td>
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
