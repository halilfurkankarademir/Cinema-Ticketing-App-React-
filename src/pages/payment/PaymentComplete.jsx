import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import jsPDF from "jspdf";
import "jspdf-barcode";
import Navbar from "../../components/Navbar";
import Footer from "../footer/Footer";
import "./PaymentComplete.css";

const PaymentComplete = () => {
    const date = new Date().toDateString();
    const location = useLocation();
    const { movieName, showTime, ticketType, ticketCount, auditorium, orderNo ,selectedSeats} =
        location.state || {};

    const toastShownRef = useRef(false);

    useEffect(() => {
        if (!toastShownRef.current) {
            toast.success('Payment complete!');
            toastShownRef.current = true;
        }
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();

        
        doc.setFont("helvetica", "bold");

        doc.setFontSize(32);
        doc.text("CineWave", 14, 10);

        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(18);
        doc.text("Ticket Details", 14, 22);

        doc.setFont("courier", "italic");
        doc.setFontSize(12);
        doc.text(`Order Number: ${orderNo}`, 14, 30);
        doc.text(`Movie Name: ${movieName}`, 14, 40);
        doc.text(`Showtime: ${date} | ${showTime}`, 14, 50);
        doc.text(`Auditorium: ${auditorium}`, 14, 60);
        doc.text(`Seats: ${selectedSeats}`, 14, 70);
        doc.text(`${ticketCount} x ${ticketType} Ticket`, 14, 80);

        doc.barcode(orderNo, {
            x: 10,
            y: 100,
            width: 150,
            height: 50,
            fontSize: 40,
            textAlign: "center",
        });

        doc.save("ticket_details.pdf");
    };

    return (
        <div>
            <Navbar></Navbar>
            <div className="container-fluid payment-complete-page">
                <h1 className="d-flex align-items-center mb-3">
                    Payment Complete &nbsp; <i className="bi bi-bag-check"></i>
                </h1>
                <h4 className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text">Ticket Details</span>
                </h4>
                <ul className="list-group mb-3 w-100">
                    <li className="list-group-item d-flex justify-content-between lh-sm">
                        <div>
                            <h6 className="my-0">Order Number</h6>
                            <small className="text-muted">{orderNo}</small>
                        </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-sm">
                        <div>
                            <h6 className="my-0">Movie Name</h6>
                            <small className="text-muted">{movieName}</small>
                        </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-sm">
                        <div>
                            <h6 className="my-0">Showtime</h6>
                            <small className="text-muted">{`${date} | ${showTime}`}</small>
                        </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-sm">
                        <div>
                            <h6 className="my-0">Auditorium</h6>
                            <small className="text-muted">{auditorium}</small>
                        </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-sm">
                        <div>
                            <h6 className="my-0">Seats</h6>
                            <small className="text-muted">{`${selectedSeats}`}</small>
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
                </ul>
                <button className="btn btn-dark e-ticket" onClick={generatePDF}>
                    Download E-Ticket
                </button>
                <Link to="/">
                    <button className="btn btn-dark e-ticket">
                        Back to homepage
                    </button>
                </Link>
            </div>
            <Toaster position="top-center"></Toaster>
            <Footer></Footer>
        </div>
    );
};

export default PaymentComplete;
