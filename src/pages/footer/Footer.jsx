import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useEffect } from 'react';

const Footer = () => {
  useEffect(() => {
    gsap.fromTo(".footer-container", 
        { opacity: 0 },  
        { opacity: 1, ease: "power4.inOut", duration: 1, delay:.2 }  
    );
    
}, []);
  
  return (
    <footer className="footer-container p-5">
        <p className="footer-text">A web-app by Halil Furkan Karademir | All rights reserved &copy; {new Date().getFullYear()}</p>
        <div className='footer-logos'>
        <Link to='https://www.instagram.com/halilfurkankarademir/'><i className="bi bi-instagram"></i></Link>
        <Link to='https://github.com/halilfurkankarademir'><i className="bi bi-github"></i></Link>
        <Link to='https://www.linkedin.com/in/halilfurkankarademir/'><i className="bi bi-linkedin"></i></Link>
        </div>
    </footer>
  );
}

export default Footer;
