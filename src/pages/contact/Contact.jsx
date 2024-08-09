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
            <form action="" className='form-container w-100' style={{backgroundColor: "#171a1d"}}>
                <h1>Contact Us &nbsp; <i className="bi bi-telephone-fill"></i></h1>
                <label htmlFor="full-name" className='mb-2'>Full Name</label>
                <input type="text" name='full-name' className='form-control text-white bg-dark border-0 mb-2'/>
                <label htmlFor="email" className='mb-2'>Email</label>
                <input type="email" name='email' className='form-control bg-dark border-0 text-white mb-2'/>
                <label htmlFor="message" className='mb-2'>Your Message</label>
                <textarea name="message" id="" className='form-control bg-dark border-0 text-white mb-2' rows="5"></textarea>
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