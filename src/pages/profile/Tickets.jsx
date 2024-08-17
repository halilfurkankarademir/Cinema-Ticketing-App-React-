import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/auth';
import { firestore, collection, getDocs } from '../../firebase/firebase';

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
            <div className='container-fluid'>
                <h1>My Tickets</h1>
                <ul>
                    {tickets.length > 0 ? (
                        tickets.map((ticket) => (
                            <li key={ticket.id}>
                                <p>Movie: {ticket.movieName}</p>
                                <p>Showtime: {ticket.showTime}</p>
                                <p>Seats: {ticket.seats.join(", ")}</p>
                                <p>Date: {ticket.date}</p>
                            </li>
                        ))
                    ) : (
                        <p>No tickets available.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Tickets;
