import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Footer from "../footer/Footer";
import QRCode from "react-qr-code";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TicketPDF from "../../components/TicketPdf"; 
import "./PaymentComplete.css";

const PaymentComplete = () => {
    const date = new Date().toDateString();
    const location = useLocation();
    const {
        movieName,
        showTime,
        ticketType,
        ticketCount,
        auditorium,
        orderNo,
        selectedSeats,
        firstname,
        lastname,
    } = location.state || {};

    const toastShownRef = useRef(false);

    useEffect(() => {
        if (!toastShownRef.current) {
            toast.success("Payment complete!");
            toastShownRef.current = true;
        }
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container-fluid payment-complete-page">
                <h1
                    className="d-flex align-items-center mb-3"
                    style={{ color: "#55C1FF" }}
                >
                    Payment Completed &nbsp; <i className="bi bi-bag-check"></i>
                </h1>
                <h4 className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text">Ticket Details</span>
                </h4>
                <ul className="list-group mb-3 w-100 ">
                    <li className="list-group-item d-flex justify-content-between lh-sm bg-dark text-white">
                        <div>
                            <h6 className="my-0" style={{ color: "#0095FF" }}>
                                Order Number
                            </h6>
                            <small className="">{orderNo}</small>
                        </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-sm bg-dark text-white">
                        <div>
                            <h6 className="my-0" style={{ color: "#0095FF" }}>
                                Name
                            </h6>
                            <small className="">{`${firstname} ${lastname}`}</small>
                        </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-sm bg-dark text-white">
                        <div>
                            <h6 className="my-0" style={{ color: "#0095FF" }}>
                                Movie Name
                            </h6>
                            <small className="">{movieName}</small>
                        </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-sm bg-dark text-white">
                        <div>
                            <h6 className="my-0" style={{ color: "#0095FF" }}>
                                Showtime
                            </h6>
                            <small className="">{`${date} | ${showTime}`}</small>
                        </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-sm bg-dark text-white">
                        <div>
                            <h6 className="my-0" style={{ color: "#0095FF" }}>
                                Seats
                            </h6>
                            <small className="">{`${selectedSeats}`}</small>
                        </div>
                    </li>
                    <li className="list-group-item d-flex justify-content-between lh-sm bg-dark text-white">
                        <div
                            style={{
                                height: "auto",
                                margin: "0 auto",
                                maxWidth: 128,
                                width: "100%",
                            }}
                        >
                            <QRCode
                                size={512}
                                style={{
                                    height: "auto",
                                    maxWidth: "100%",
                                    width: "100%",
                                }}
                                value={`${orderNo}\n${firstname} ${lastname}\n${movieName}\n${date} | ${showTime}\n${selectedSeats}`}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                    </li>
                </ul>
                <PDFDownloadLink
                    document={
                        <TicketPDF
                            orderNo={orderNo}
                            firstname={firstname}
                            lastname={lastname}
                            movieName={movieName}
                            showTime={showTime}
                            date={date}
                            selectedSeats={selectedSeats}
                        />
                    }
                    fileName="ticket_details.pdf"
                    className="btn btn-dark e-ticket"
                >
                    {({ loading }) =>
                        loading ? "Generating PDF..." : "Download E-Ticket"
                    }
                </PDFDownloadLink>
                <Link to="/">
                    <button className="btn btn-dark e-ticket">
                        Back to homepage
                    </button>
                </Link>
            </div>
            <Toaster position="top-center"></Toaster>
            <Footer />
        </div>
    );
};

export default PaymentComplete;
