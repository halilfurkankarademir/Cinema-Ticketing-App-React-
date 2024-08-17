import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/auth';
import { firestore, doc, setDoc, getDoc } from "../../firebase/firebase";
import { doPasswordChange } from '../../firebase/auth';
import './Profile.css';

const Profile = () => {
    const { currentUser } = useAuth();
    const [name, setName] = useState(currentUser.displayName || "");
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocRef = doc(firestore, "users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setName(data.fullname || "");
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        if (currentUser) {
            fetchUserData();
        }
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            
            const userDocRef = doc(firestore, "users", currentUser.uid);
            await setDoc(userDocRef, {
                fullname: name,
                
            }, { merge: true });

           
            if (password) {
               
                await doPasswordChange(currentUser, password);
            }
            
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile.");
        } finally {
            setLoading(false);
        }
    };

    console.log(currentUser);

    return (
        <div>
            <Navbar />
            <div className='container-fluid profile-page'>
                <form className='form' onSubmit={handleSubmit}>
                    <label htmlFor="name">Full Name</label>
                    <input 
                        type="text" 
                        name='name' 
                        className='form-control mb-4' 
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                    />
                    <label htmlFor="email">Email</label>
                    <input 
                        type="text" 
                        name='email' 
                        className='form-control mb-4' 
                        value={currentUser.email} 
                        disabled
                    />
                    <label htmlFor="pass">Password</label>
                    <input 
                        type="password" 
                        name='pass' 
                        className='form-control mb-4' 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <button className='btn btn-dark' type='submit' disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
