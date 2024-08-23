import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Footer from "./footer/Footer";
import { firestore, collection, getDocs } from "../firebase/firebase";
import gsap from "gsap";
import Modal from 'react-modal';
import "./Vision.css";

const OnLive = () => {
    const [movies, setMovies] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(true);

    const [isClosedAdModal, setIsClosedAdModal] = useState(
        JSON.parse(localStorage.getItem('isClosedAdModal')) || false
    );
    
    const closeModal = () => {
        localStorage.setItem('isClosedAdModal', JSON.stringify(true));
        setIsClosedAdModal(true);
    };

    window.onload = function() {
        window.scrollTo(0, 0);
    };
    useEffect(() => {
        gsap.fromTo(".secondSectionVision", 
            { opacity: 0 },  
            { opacity: 1, ease: "power4.inOut", duration: 1, delay:.5 }  
        );
        
    }, []);

    useEffect(() => {

        const fetchMovies = async () => {
            try {
                const moviesCollection = collection(firestore, "movies");
                const movieSnapshot = await getDocs(moviesCollection);
                const movieList = movieSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMovies(movieList);
            } catch (error) {
                console.error("Error fetching movies: ", error);
            }
        };
        document.title = "CineWave | Vision Movies";
        fetchMovies();
    }, []);

    return (
        <div>
            {
                !isClosedAdModal && (
                    <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={{
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        transform: "translate(-50%, -50%)",
                        width: "100%",
                        maxWidth: "640px",
                        border: "none",
                        padding: "0",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    },
                }}
            >
                <button
                    onClick={closeModal}
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "transparent",
                        border: "none",
                        fontSize: "24px",
                        cursor: "pointer",
                        color:'white',
                    }}
                >
                    &times;
                </button>
                <img
                    src="https://i.imghippo.com/files/g34SJ1724376215.jpg"
                    alt="Kampanya Fotoğrafı"
                    style={{ width: "100%", height: "auto" }}
                />
            </Modal>
                )
                    
                
            }
            
            <Navbar />
            <div className="container-fluid secondSectionVision">
                <h3>
                   <i className="bi bi-stars"></i> Vision Movies 
                </h3>
                <div className="row">
                    {movies.map((movie) => (
                        <div className="col-md-4" key={movie.id}>
                            <Card
                                title={movie.title}
                                desc={movie.description}
                                img={movie.imageUrl}
                                movieId={movie.id}
                                type={movie.type}
                                duration={movie.duration}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default OnLive;
