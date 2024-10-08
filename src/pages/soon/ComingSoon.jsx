import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../footer/Footer'
import CardComing from "../../components/cardcoming/CardComing"
import gsap from 'gsap'
import { firestore, collection, getDocs } from "../../firebase/firebase";
import { useEffect, useState } from 'react';
import Preloader from '../../components/preloader/Preloader'
import './ComingSoon.css'

const ComingSoon = () => {
    
    const [movies, setMovies] = useState([]);
    const [selectedTrailer, setSelectedTrailer] = useState(null);
    const [videoVisible, setVideoVisible] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const moviesCollection = collection(firestore, 'upcoming');
                const movieSnapshot = await getDocs(moviesCollection);
                const movieList = movieSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMovies(movieList);
            } catch (error) {
                console.error("Error fetching movies: ", error);
            }
        };
        document.title = "CineWave | Upcoming"
        fetchMovies();
    }, []);
    
  


    const openVideo = (trailerUrl) => {//Open trailer 
        setSelectedTrailer(trailerUrl);
        setVideoVisible(true);
    };

    const closeVideo = () => {//Close trailer
        setVideoVisible(false);
        setSelectedTrailer(null);
    };

    console.log(movies);


    return (
    <div>
        <div>
            <Preloader/>
            <Navbar />
            <br /> <br /> <br /> <br /> <br /> <br />
            <div className="container-fluid secondSectionUpcoming">
                <h3><i className="bi bi-hourglass-split"></i> Upcoming Movies </h3>
                <div className="row">
                    {movies.map((movie) => (
                        <div className="col-md-4" key={movie.id}>
                            <CardComing
                                title={movie.title}
                                desc={movie.description}
                                img={movie.imageUrl}
                                movieId={movie.id} 
                                date={movie.date}
                                trailer={movie.trailerUrl}
                                openModal={openVideo} 
                            />
                        </div>
                    ))}
                </div>
            </div>
            {selectedTrailer && (
                    <div className="video-player-overlay" onClick={closeVideo}>
                        <div className="video-player">
                            <iframe
                                width="100%"
                                height="480"
                                src={selectedTrailer}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                )}
            <Footer></Footer>
        </div>
    </div>
  )
}

export default ComingSoon