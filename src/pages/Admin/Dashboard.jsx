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
import { useAuth } from "../../context/auth";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalSoldTickets, setTotalSoldTickets] = useState(0);
    const [visionMovieCount, setVisionMovieCount] = useState(0);
    const [images, setImages] = useState(["", "", ""]);
    const [titles, setTitles] = useState(["", "", ""]);
    const [types, setTypes] = useState(["", "", ""]);
    const [durations, setDurations] = useState(["", "", ""]);
    const navigate = useNavigate();
    const {userLoggedIn,currentUser} = useAuth();

    console.log(currentUser);

   

    useEffect(() => {
        const fetchData = async () => {
            try {
                const revenueDocRef = doc(firestore, "datas", "totalRevenueDocId");
                const revenueSnap = await getDoc(revenueDocRef);
                if (revenueSnap.exists()) {
                    setTotalRevenue(revenueSnap.data().totalRevenue || 0);
                }

                const ticketsDocRef = doc(firestore, "datas", "totalSoldTicketsDocId");
                const ticketsSnap = await getDoc(ticketsDocRef);
                if (ticketsSnap.exists()) {
                    setTotalSoldTickets(ticketsSnap.data().totalSoldTicketCount || 0);
                }

                const moviesCollectionRef = collection(firestore, "movies");
                const moviesSnap = await getDocs(moviesCollectionRef);
                setVisionMovieCount(moviesSnap.size || 0);

              
                const carouselDocRef = doc(firestore, "carouselimages", "carouselDocId");
                const carouselSnap = await getDoc(carouselDocRef);
                if (carouselSnap.exists()) {
                    const data = carouselSnap.data();
                    setImages(data.imgUrls || ["", "", ""]);
                    setTitles(data.titles || ["", "", ""]);
                    setTypes(data.types || ["", "", ""]);
                    setDurations(data.durations || ["", "", ""]);
                } else {
                    console.error("No carousel document found!");
                }
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        if(!userLoggedIn){
            navigate('/login')
        }
        document.title = "CineWave | Admin";
        fetchData();
    }, []);

    const addCarousel = async (e) => {
        e.preventDefault();
        const customId = "carouselDocId";
        if (images.every(img => img !== "") &&
            titles.every(title => title !== "") &&
            types.every(type => type !== "") &&
            durations.every(duration => duration !== "")) {
            try {
                const docRef = doc(firestore, "carouselimages", customId);
                await setDoc(docRef, {
                    imgUrls: images,
                    titles: titles,
                    types: types,
                    durations: durations
                });
                toast.success("Carousel images updated successfully!");
            } catch (error) {
                console.error("Error adding images to Firestore: ", error);
            }
        } else {
            toast.error("Fill all fields");
        }
    };

    const handleImageChange = (index, value) => {
        const newImages = [...images];
        newImages[index] = value;
        setImages(newImages);
    };

    const handleTitleChange = (index, value) => {
        const newTitles = [...titles];
        newTitles[index] = value;
        setTitles(newTitles);
    };

    const handleTypeChange = (index, value) => {
        const newTypes = [...types];
        newTypes[index] = value;
        setTypes(newTypes);
    };

    const handleDurationChange = (index, value) => {
        const newDurations = [...durations];
        newDurations[index] = value;
        setDurations(newDurations);
    };



    return (
        <div>
            <Toaster position="top-center"></Toaster>
            <AdminNav />
            <br /> <br /> <br /> <br /> <br /> <br />
            <h1 style={{position:'relative', left:'8rem', fontSize:'150%'}}>Admin Dashboard</h1>
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
                            Change homepage carousel images. (All fields should be filled!)
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
                                <label htmlFor={`title${index}`}>
                                    Image {index + 1} Title{" "}
                                </label>
                                <input
                                    type="text"
                                    name={`title${index}`}
                                    className="form-control bg-dark border-0 text-white"
                                    value={titles[index]}
                                    onChange={(e) =>
                                        handleTitleChange(index, e.target.value)
                                    }
                                    required
                                />
                                <label htmlFor={`type${index}`}>
                                    Image {index + 1} Type{" "}
                                </label>
                                <input
                                    type="text"
                                    name={`type${index}`}
                                    className="form-control bg-dark border-0 text-white"
                                    value={types[index]}
                                    onChange={(e) =>
                                        handleTypeChange(index, e.target.value)
                                    }
                                    required
                                />
                                <label htmlFor={`duration${index}`}>
                                    Image {index + 1} Duration{" "}
                                </label>
                                <input
                                    type="text"
                                    name={`duration${index}`}
                                    className="form-control bg-dark border-0 text-white"
                                    value={durations[index]}
                                    onChange={(e) =>
                                        handleDurationChange(index, e.target.value)
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
