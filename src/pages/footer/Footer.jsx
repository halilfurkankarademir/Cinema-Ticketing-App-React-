import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-container">
        <p className="footer-text">A web-app by Halil Furkan Karademir | All rights reserved &copy; {new Date().getFullYear()}</p>
        <div className='footer-logos'>
        <Link to='https://www.instagram.com/halilfurkankarademir/'><i class="bi bi-instagram"></i></Link>
        <Link to='https://github.com/halilfurkankarademir'><i class="bi bi-github"></i></Link>
        <Link to='https://www.linkedin.com/in/halilfurkankarademir/'><i class="bi bi-linkedin"></i></Link>
        </div>
    </footer>
  );
}

export default Footer;
