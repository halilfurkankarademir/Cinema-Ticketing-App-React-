import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { firestore, doc, getDoc } from "../firebase/firebase";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./BgSlider.css";

const HeroSlider = () => {
    const [images, setImages] = useState([]);
    const [titles, setTitles] = useState([]);
    const [types, setTypes] = useState([]);
    const [durations, setDurations] = useState([]);

    const settings = {
        infinite: true,
        speed: 1500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: false,
        arrows:false,
        
    };
    useGSAP(() => {
        gsap.from(".hero-slider", {
            opacity: 0,
            scale:1.2,
            ease: "power4.inOut",
            duration: 2,
            delay:1
        });
    }, []);
    

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const imgRef = doc(firestore, "carouselimages", "carouselDocId");
                const imgSnap = await getDoc(imgRef);
                if (imgSnap.exists()) {
                    const data = imgSnap.data();
                    setImages(data.imgUrls || []);
                    setTitles(data.titles || []);
                    setTypes(data.types || []);
                    setDurations(data.durations || []);
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching images: ", error);
            }
        };
        

        fetchImages();
    }, []);

    return (
        <div className="hero-slider" id="slider"> 
            <Slider {...settings}>  
                {images.map((imgUrl, index) => (
                    <div className="hero-slide" key={index}>
                        <h3 className="slide-text" style={{fontWeight:'600'}}>{titles[index]}</h3>
                        <p className="slide-text" style={{fontWeight:'300'}}>{types[index]}</p>
                        <p className="slide-text" style={{fontWeight:'300'}}>{durations[index]}</p>
                        <img src={imgUrl} alt={`Slide ${index + 1}`} /> 
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HeroSlider;
