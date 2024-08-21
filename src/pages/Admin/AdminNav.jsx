import React, { useState } from "react";
import { Link } from "react-router-dom";
import { doSignOut } from "../../firebase/auth";
import { useNavigate } from 'react-router-dom';
import './AdminNav.css'


const Navbar = () => {
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const navigate = useNavigate();
    function signOut(){
        doSignOut();
        navigate('/');
    }

    function logo(){
        navigate('/admin');
    }
    return (
        <div>
            <div className="navbar bg-transparent">
                <div className="brandAdmin" onClick={logo}>
                    <h2>CineWave</h2>
                </div>
            </div>
            <div
                className={`container-fluid NavmenuAdmin`}
            >
                <Link to="/admin/manage">
                    Manage Movies
                </Link>
                <Link to="/admin/addtheater">
                    Theaters
                </Link>
                <Link to="/admin/managecomments">
                    Comments
                </Link>
                <Link to="/admin/reservations">
                    Reservations
                </Link>
                <button onClick={signOut} className="btn btn-light signOutButton"><i class="bi bi-box-arrow-right"></i></button>
            </div>
        </div>
    );
};

export default Navbar;
