import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth'
import toast, { Toaster } from 'react-hot-toast';
import './Register.css' // Import the new CSS file

const Register = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isRegistering) {
           
            if(password==confirmPassword){
                setIsRegistering(true)
                await doCreateUserWithEmailAndPassword(email, password)
        }
            else{
                toast.error("Passwords don't match!")
            }
        }
    }

    return (
        <>
            {userLoggedIn && (<Navigate to={'/'} replace={true} />)}

            <main className="register-container">
                <div className="register-wrapper">
                    <div className="register-header">
                        <h3 style={{color:'#55c1ff'}}>Create a New Account</h3>
                    </div>
                    <form
                        onSubmit={onSubmit}
                        className="register-form"
                    >
                        <div>
                            <label className="register-form-label text-white">
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                                className="register-form-input bg-dark text-white border-0"
                            />
                        </div>

                        <div>
                            <label className="register-form-label text-white">
                                Password
                            </label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='new-password'
                                required
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                                className="register-form-input bg-dark text-white border-0"
                            />
                        </div>

                        <div>
                            <label className="register-form-label text-white">
                                Confirm Password
                            </label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='off'
                                required
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value) }}
                                className="register-form-input bg-dark text-white border-0"
                            />
                        </div>

                        {errorMessage && (
                            <span className='register-error-message'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`register-submit-button ${isRegistering ? 'disabled' : ''}`}
                        >
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        <div className="register-signup-link">
                            Already have an account? {' '}
                            <Link to={'/login'} className="register-signup-link">Login</Link>
                        </div>
                    </form>
                </div>
                <Toaster
                position="top-center"
                reverseOrder={true}
                />
            </main>
        </>
    )
}

export default Register
