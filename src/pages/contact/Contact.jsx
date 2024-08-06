import React from 'react'
import Footer from '../footer/Footer'
import Navbar from '../../components/Navbar'
import './Contact.css'
import toast, { Toaster } from 'react-hot-toast';

const Contact = () => {
  document.title = "CineWave | Contact"
  return (
    <div>
        <Navbar></Navbar>
        <div className='container-fluid contactForm'>
            <form action="" className='form-container w-100'>
                <h1>Contact Us &nbsp; <i class="bi bi-telephone-fill"></i></h1>
                <label htmlFor="full-name">Full Name</label>
                <input type="text" name='full-name' className='form-control'/>
                <label htmlFor="email">Email</label>
                <input type="email" name='email' className='form-control'/>
                <label htmlFor="message">Your Message</label>
                <textarea name="message" id="" className='form-control' rows="5"></textarea>
                <br />
                <button type='button' className='btn btn-dark' onClick={()=>toast.success('Your message has been sent!')}>Send Message</button>
                <Toaster
                position="top-center"
                reverseOrder={true}
                />
            </form>
        </div>
        <Footer></Footer>
    </div>
  )
}

export default Contact