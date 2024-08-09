import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { PDFDownloadLink } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#f3f4f6",
        padding: 24,
        fontFamily: "Helvetica",
    },
    section: {
        margin: 10,
        padding: 10,
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        color: "#007BFF",
        marginBottom: 10,
    },
    ticketDetails: {
        borderRadius: 8,
        padding: 15,
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
    },
    heading: {
        fontSize: 14,
        marginBottom: 4,
        color: "#555",
    },
    text: {
        fontSize: 12,
        color: "#333",
        marginBottom: 10,
    },
    qrCode: {
        marginTop: 20,
        alignSelf: "center",
    },
    footer: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 10,
        color: "#999",
    },
});

const TicketPDF = ({
    orderNo,
    firstname,
    lastname,
    movieName,
    showTime,
    date,
    selectedSeats,
}) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>🎬 CineWave E-Ticket</Text>
                <View style={styles.ticketDetails}>
                    <Text style={styles.heading}>Order Number</Text>
                    <Text style={styles.text}>{orderNo}</Text>

                    <Text style={styles.heading}>Name</Text>
                    <Text style={styles.text}>{`${firstname} ${lastname}`}</Text>

                    <Text style={styles.heading}>Movie Name</Text>
                    <Text style={styles.text}>{movieName}</Text>

                    <Text style={styles.heading}>Showtime</Text>
                    <Text style={styles.text}>{`${date} | ${showTime}`}</Text>

                    <Text style={styles.heading}>Seats</Text>
                    <Text style={styles.text}>{selectedSeats.join(", ")}</Text>
                </View>
                <View style={styles.qrCode}>
                    <Image
                        style={{ width: 100, height: 100 }}
                        src={`https://api.qrserver.com/v1/create-qr-code/?data=${orderNo}\n${firstname} ${lastname}\n${movieName}\n${date} | ${showTime}\n${selectedSeats.join(", ")}`}
                    />
                </View>
                <Text style={styles.footer}>
                    Enjoy your movie! Thank you for choosing CineWave.
                </Text>
            </View>
        </Page>
    </Document>
);

export default TicketPDF