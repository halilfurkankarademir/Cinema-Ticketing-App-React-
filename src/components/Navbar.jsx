import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/auth";
import { doSignOut } from "../firebase/auth";

const Navbar = () => {
    const [toggleSidebar, setToggleSidebar] = useState(false);

    const { currentUser, userLoggedIn } = useAuth();

    const navigate = useNavigate();

    const showMenu = (e) => {
        e.preventDefault();
        setToggleSidebar((prev) => !prev);
    };

    const handleLinkClick = () => {
        setToggleSidebar(false);
    };

    const handleLogOut = async () => {
        await doSignOut();
    };

    const redicert = () =>{
        navigate('/');
    }

    return (
        <div>
            <div className="navbar bg-transparent">
                <div className="brand" onClick={redicert}>
                    <h2>CineWave</h2>
                </div>
                <i className="bi bi-list" onClick={showMenu}></i>
            </div>
            <div
                className={`container-fluid Navmenu`}
            >
                <Link to="/">
                    Homepage
                </Link>
                <Link to="/vision">
                    Vision Movies
                </Link>
                <Link to="/soon">
                    Coming Soon
                </Link>
                <Link to="/contact">
                    Contact
                </Link>
                <Link to="/login">
                    <i className="bi bi-person-fill"></i>
                </Link>
                {
                    userLoggedIn && (
                        <Link to='/admin' className="adminButton">
                           <button className="btn btn-light">Admin</button>
                        </Link>
                    )
                }
                
                

            </div>
            <div
                className={`container-fluid menu ${
                    toggleSidebar ? "active" : ""
                }`}
                id="sidebarMenu"
            >
                <Link to="/" onClick={handleLinkClick}>
                    Homepage
                </Link>
                <Link to="/vision" onClick={handleLinkClick}>
                    Vision Movies
                </Link>
                <Link to="/soon" onClick={handleLinkClick}>
                    Coming Soon
                </Link>
                <Link to="/contact" onClick={handleLinkClick}>
                    Contact
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
