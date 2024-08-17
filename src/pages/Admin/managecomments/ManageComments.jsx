import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../../context/auth";
import { doSignOut } from "../../../firebase/auth";
import {
    firestore,
    collection,
    getDocs,
    deleteDoc,
    doc,
} from "../../../firebase/firebase";
import toast, { Toaster } from "react-hot-toast";
import AdminNav from "../AdminNav";
import "./ManageComments.css";

const ManageComments = () => {
    const { currentUser, userLoggedIn,isAdmin } = useAuth();
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoggedIn || !isAdmin) {
            navigate("/login");
        } else {
            const fetchComments = async () => {
                try {
                    const commentsCollection = collection(firestore, "ratings");
                    const commentsSnapshot = await getDocs(commentsCollection);
                    const commentsList = commentsSnapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));
                    setComments(commentsList);
                } catch (error) {
                    console.error("Error fetching comments: ", error);
                }
            };

            document.title = "CineWave | Manage Comments";
            fetchComments();
        }
    }, [userLoggedIn, navigate]);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(firestore, "ratings", id));
            setComments(comments.filter((comment) => comment.id !== id));
            toast.success("Comment deleted successfully!");
        } catch (error) {
            console.error("Error deleting comment: ", error);
            toast.error("Error deleting comment.");
        }
    };

    function signOut() {
        doSignOut();
        navigate("/");
    }

    if (!userLoggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <AdminNav></AdminNav>
            <br /> <br /> <br /> <br /> <br /> <br /> <br /> <br />
            <div className="admin-panel">
                <Toaster position="top-center"></Toaster>
                <div className="container-fluid secondSectionComments">
                    <h3>Comments</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col"  style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Movie</th>
                                <th scope="col"  style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Rating</th>
                                <th scope="col"  style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Comment</th>
                                <th scope="col"  style={{color:'#0095FF' ,backgroundColor:'#171a1d'}}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments.map((comment) => (
                                <tr key={comment.id}>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>{comment.title}</td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>{comment.rating}</td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>{comment.comment}</td>
                                    <td className="text-white"  style={{backgroundColor:'#171a1d'}}>
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="btn btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageComments;
