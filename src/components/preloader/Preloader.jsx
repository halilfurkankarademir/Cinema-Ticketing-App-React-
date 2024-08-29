import React from "react";
import gsap from "gsap";
import { useEffect } from "react";
import './Preloader.css'

const Preloader = () => {
    useEffect(() => {
        gsap.fromTo(
            ".pre-loader",
            { y: 0 },
            { y: "100%", ease: "power4.inOut", duration: 2 , delay:1 }
        );
    }, []);

    return (
        <div>
            <div className="container-fluid d-flex justify-content-center align-content-center h-100 pre-loader flex-column">
                <h4>Loading</h4>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
