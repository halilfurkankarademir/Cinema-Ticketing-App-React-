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
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [tel, setTel] = useState("");
    const [balance,setBalance] = useState(0);
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoggedIn) {
            navigate("/login");
        }
        document.title = "CineWave | My Profile"
    }, [userLoggedIn, navigate]);

    useEffect(() => {
        const fetchUserData = async () => {//Get user datas and set into states
            if (!currentUser) return;

            try {
                const userDocRef = doc(firestore, "users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setFirstName(data.firstname || "");
                    setLastName(data.lastname || "");
                    setTel(data.tel || "");
                    setBalance(data.balance || "0");
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

    const redirectTickets = () =>{
        navigate('/tickets');
    }


    const handlePasswordReset = async () => {//Do password reset using firebase auth
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

    const handleSubmit = async (e) => {//Save changes
        e.preventDefault();
        setLoading(true);
        try {
            if (!currentUser) return; 
            
            const userDocRef = doc(firestore, "users", currentUser.uid);
            await setDoc(
                userDocRef,
                {
                    firstname: firstname,
                    lastname: lastname,
                    tel:tel,
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

    console.log(tel);

    return (
        <div>
            <Navbar />
            <div className="container-fluid profile-page">
                <form className="form-container profile-form" onSubmit={handleSubmit} style={{backgroundColor:'#171a1d'}}>
                    <h4 className="text-center mb-4" style={{color: "#55c1ff"}}> <i class="bi bi-person-badge"></i> Profile Settings</h4>
                    <label htmlFor="name" className="mb-2">First Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control mb-4 bg-dark text-white border-0"
                        value={firstname}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <label htmlFor="name" className="mb-2">Last Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control mb-4 bg-dark text-white border-0"
                        value={lastname}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <label htmlFor="email" className="mb-2">Email</label>
                    <input
                        type="text"
                        name="email"
                        className="form-control mb-4 bg-dark text-white border-0"
                        value={currentUser.email}
                        disabled
                    />
                    <label htmlFor="phone" className="mb-2">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        className="form-control mb-4 bg-dark text-white border-0"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                    />
                    <label htmlFor="balance" className="mb-2">Balance</label>
                    <input
                        type="text"
                        name="balance"
                        className="form-control mb-4 bg-dark text-white border-0"
                        value={`$ ${balance}`}
                        disabled
                    />
                    <button
                        className="btn btn-dark profile-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        className="btn btn-dark profile-button3"
                        type="button"
                        onClick={handlePasswordReset}
                    >
                        Reset Password
                    </button>
                    <button
                        className="btn btn-danger profile-button2"
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
            />
        </div>
    );
};

export default Profile;
