import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { firestore, doc, getDoc } from "../firebase/firebase";
import "./BgSlider.css";

const HeroSlider = () => {
    const [images, setImages] = useState([]);

    const settings = {
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: false,
    };

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const imgRef = doc(firestore, "carouselimages", "carouselDocId");
                const imgSnap = await getDoc(imgRef);
                if (imgSnap.exists()) {
                    const data = imgSnap.data();
                    setImages(data.imgUrls || []);
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
                        <h3 className="slide-text" style={{fontWeight:'600'}}>Inside Out 2</h3>
                        <p className="slide-text" style={{fontWeight:'300'}}>Animation</p>
                        <p className="slide-text" style={{fontWeight:'300'}}>1h 45m</p>
                        <img src={imgUrl} alt={`Slide ${index + 1}`} /> 
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HeroSlider;
