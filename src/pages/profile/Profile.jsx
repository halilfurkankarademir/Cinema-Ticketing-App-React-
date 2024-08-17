import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/auth";
import { firestore, doc, setDoc, getDoc } from "../../firebase/firebase";
import { doPasswordChange, doPasswordReset, doSignOut } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import "./Profile.css";

const Profile = () => {
    const { currentUser, userLoggedIn } = useAuth();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoggedIn) {
            navigate("/login");
        }
    }, [userLoggedIn, navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser) return;

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

    const handlePasswordReset = async () => {
        if (!currentUser || !currentUser.email) return;

        try {
            await doPasswordReset(currentUser.email);
            toast.success("Password reset email sent!");
        } catch (error) {
            toast.error("Error sending password reset email.");
        }
    };

    const signOutFunc = async () => {
        try {
            await doSignOut();
            navigate('/');
        } catch (error) {
            toast.error("Error signing out.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!currentUser) return; 
            
            const userDocRef = doc(firestore, "users", currentUser.uid);
            await setDoc(
                userDocRef,
                {
                    fullname: name,
                },
                { merge: true }
            );

            if (password) {
                await doPasswordChange(password);
            }

            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Error updating profile.");
        } finally {
            setLoading(false);
        }
    };

   
    if (!userLoggedIn) {
        return null;
    }

    return (
        <div>
            <Navbar />
            <div className="container-fluid profile-page">
                <form className="form-container" onSubmit={handleSubmit} style={{backgroundColor:'#171a1d'}}>
                    <h4 className="text-center mb-4">Profile Settings</h4>
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control mb-4 bg-dark text-white border-0"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        className="form-control mb-4 bg-dark text-white border-0"
                        value={currentUser.email}
                        disabled
                    />
                    <button
                        className="btn btn-dark"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        className="btn btn-dark mt-2"
                        type="button"
                        onClick={handlePasswordReset}
                    >
                        Reset Password
                    </button>
                    <button
                        className="btn btn-danger mt-2"
                        type="button"
                        onClick={signOutFunc}
                    >
                        Sign out
                    </button>
                </form>
            </div>
            <Toaster
                position="top-center"
                reverseOrder={true}
                />s
        </div>
    );
};

export default Profile;
