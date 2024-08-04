import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../footer/Footer'
import Card from '../../components/Card'
import { firestore, collection, getDocs } from "../../firebase/firebase";
import { useEffect, useState } from 'react';
import './ComingSoon.css'

const ComingSoon = () => {
    
    const [movies, setMovies] = useState([]);

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
            <div className="container-fluid secondSection">
                <h3>Upcoming Movies</h3>
                <div className="row">
                    {movies.map((movie) => (
                        <div className="col-md-3" key={movie.id}>
                            <Card
                                title={movie.title}
                                desc={movie.description}
                                img={movie.imageUrl}
                                movieId={movie.id} 
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