import React, { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import {doPasswordReset} from "../../firebase/auth";
import { useAuth } from "../../context/auth";
import toast, { Toaster } from 'react-hot-toast';
import './Login.css';

const Login = () => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
  
    document.title = "CineWave | Login"
    
    const onSubmit = async (e) => {
        e.preventDefault();
        doPasswordReset(email);
        toast.success('Password reset email has been sent!');
        }
    

    return (
        <div>
            {userLoggedIn && (<Navigate to={'/'} replace={true} />)}
            <main className="login-container">
                <div className="login-wrapper">
                    <div className="login-header">
                        <h3 style={{color:'#55c1ff'}}>Reset Password</h3>
                    </div>
                    <form onSubmit={onSubmit} className="login-form">
                        <div>
                            <input
                                type="email"
                                autoComplete='email'
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); }}
                                className="login-form-input bg-dark text-white border-0"
                            />
                        </div>
                        <button type="submit" className="btn btn-dark">Send Reset Mail</button>
                    </form>
                </div>
            </main>
            <Toaster
                position="top-center"
                reverseOrder={true}
            />
        </div>
    );
}

export default Login;
