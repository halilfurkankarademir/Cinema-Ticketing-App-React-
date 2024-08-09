import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../footer/Footer'
import CardComing from "../../components/cardcoming/CardComing"
import { ScrollRestoration } from 'react-router-dom'
import { firestore, collection, getDocs } from "../../firebase/firebase";
import { useEffect, useState } from 'react';
import './ComingSoon.css'

const ComingSoon = () => {
    
    const [movies, setMovies] = useState([]);

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
    
  
    return (
    <div>
        <div>
            <Navbar />
            <br /> <br /> <br /> <br /> <br /> <br />
            <div className="container-fluid secondSectionUpcoming">
                <h3><i className="bi bi-hourglass-split"></i> Upcoming Movies </h3>
                <div className="row">
                    {movies.map((movie) => (
                        <div className="col-md-3" key={movie.id}>
                            <CardComing
                                title={movie.title}
                                desc={movie.description}
                                img={movie.imageUrl}
                                movieId={movie.id} 
                                date={movie.date} 
                            />
                        </div>
                    ))}
                </div>
            </div>
            <Footer></Footer>
        </div>
    </div>
  )
}

export default ComingSoon