import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Footer from './footer/Footer';
import { firestore, collection, getDocs } from '../firebase/firebase';
import './Vision.css';

const OnLive = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const moviesCollection = collection(firestore, 'movies');
                const movieSnapshot = await getDocs(moviesCollection);
                const movieList = movieSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMovies(movieList);
            } catch (error) {
                console.error("Error fetching movies: ", error);
            }
        };
        document.title = "CineWave | Vision Movies"
        fetchMovies();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container-fluid secondSectionVision">
                <h3>Vision Movies <i class="bi bi-stars"></i></h3>
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
    );
};

export default OnLive;
