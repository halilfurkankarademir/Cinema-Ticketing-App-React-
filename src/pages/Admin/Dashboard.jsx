import React, { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import {
    firestore,
    doc,
    getDoc,
    collection,
    getDocs,
    setDoc,
} from "../../firebase/firebase";
import toast, { Toaster } from "react-hot-toast";
import "./Dashboard.css";

const Dashboard = () => {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalSoldTickets, setTotalSoldTickets] = useState(0);
    const [visionMovieCount, setVisionMovieCount] = useState(0);
    const [images, setImages] = useState(["", "", ""]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const revenueDocRef = doc(
                    firestore,
                    "datas",
                    "totalRevenueDocId"
                );
                const revenueSnap = await getDoc(revenueDocRef);
                if (revenueSnap.exists()) {
                    setTotalRevenue(revenueSnap.data().totalRevenue || 0);
                }

                const ticketsDocRef = doc(
                    firestore,
                    "datas",
                    "totalSoldTicketsDocId"
                );
                const ticketsSnap = await getDoc(ticketsDocRef);
                if (ticketsSnap.exists()) {
                    setTotalSoldTickets(
                        ticketsSnap.data().totalSoldTicketCount || 0
                    );
                }

                const moviesCollectionRef = collection(firestore, "movies");
                const moviesSnap = await getDocs(moviesCollectionRef);
                setVisionMovieCount(moviesSnap.size || 0);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        document.title = "CineWave | Admin";
        fetchData();
    }, []);

    const addCarousel = async (e) => {
        e.preventDefault();
        const customId = "carouselDocId";
        if (images[0] !== "" && images[1] !== "" && images[2] !== "") {
            try {
                const docRef = doc(firestore, "carouselimages", customId);
                await setDoc(docRef, {
                    imgUrls: images,
                });
                toast.success("Carousel images updated successfully!");
            } catch (error) {
                console.error("Error adding images to Firestore: ", error);
            }
        } else {
            toast.error("Fill all the Url's");
        }
    };

    const handleImageChange = (index, value) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };

    return (
        <div>
            <Toaster position="top-center"></Toaster>
            <AdminNav />
            <br /> <br /> <br /> <br /> <br /> <br />
            <h1>&emsp; &emsp; &emsp; Admin Dashboard</h1>
            <div className="container mt-4">
                <div className="row">
                    <div className="col chart-card">
                        <p>Total Revenue</p>
                        <i className="bi bi-bank"></i>
                        <h1 className="text-center text-white">
                            ${totalRevenue}
                        </h1>
                    </div>
                    <div className="col chart-card">
                        <p>Total Sold Ticket Count</p>
                        <i className="bi bi-ticket"></i>
                        <h1 className="text-center text-white">
                            {totalSoldTickets}
                        </h1>
                    </div>
                    <div className="col chart-card">
                        <p>Vision Movie Count</p>
                        <i className="bi bi-film"></i>
                        <h1 className="text-center text-white">
                            {visionMovieCount}
                        </h1>
                    </div>
                    <form action="" className="form-container changeCarousel">
                        <p>
                            Change homepage carousel images.(All url's should be filled!)
                        </p>
                        {images.map((img, index) => (
                            <div key={index}>
                                <label htmlFor={`img${index}`}>
                                    Image {index + 1} URL{" "}
                                    <i className="bi bi-link-45deg"></i>
                                </label>
                                <input
                                    type="text"
                                    name={`img${index}`}
                                    className="form-control bg-dark border-0 text-white"
                                    value={img}
                                    onChange={(e) =>
                                        handleImageChange(index, e.target.value)
                                    }
                                    required
                                />
                            </div>
                        ))}
                        <button
                            type="submit"
                            className="btn btn-dark save-button"
                            onClick={addCarousel}
                        >
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
