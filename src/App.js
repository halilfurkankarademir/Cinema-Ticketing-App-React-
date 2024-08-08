import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomePage from "./pages/HomePage";
import Vision from "./pages/Vision";
import ComingSoon from "./pages/soon/ComingSoon";
import SelectSeat from "./pages/SelectSeat"
import Payment from "./pages/payment/Payment";
import PaymentComplete from "./pages/payment/PaymentComplete";
import MovieDetail from "./pages/MovieDetail";
import RateMovie from "./pages/rate/RateMovie";
import Login from "./components/auth/Login";
import Dashboard from "./pages/Admin/Dashboard";
import ManageMovies from "./pages/Admin/ManageMovies"
import ManageRes from "./pages/Admin/managereservations/ManageRes";
import AddMovie from "./pages/Admin/AddMovie";
import EditMovie from "./pages/Admin/EditMovie";
import Upcoming from "./pages/Admin/Upcoming";
import ManageComments from "./pages/Admin/managecomments/ManageComments";
import Footer from "./pages/footer/Footer";
import { AuthProvider } from "./context/auth";
import { HashRouter, Route, Routes } from "react-router-dom";
import Contact from "./pages/contact/Contact";


const Wrapper = () => {
    return (
        <AuthProvider>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/vision" element={<Vision />} />
                        <Route path="/soon" element={<ComingSoon />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/select-seat/:id" element={<SelectSeat />} />
                        <Route path="/movie/:id" element={<MovieDetail />} />
                        <Route path="/rate/:id" element={<RateMovie />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/paymentcomplete" element={<PaymentComplete />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin" element={<Dashboard />} />
                        <Route path="/admin/addmovie" element={<AddMovie />} />
                        <Route path="/admin/manage" element={<ManageMovies />} />
                        <Route path="/admin/managecomments" element={<ManageComments />} />
                        <Route path="/admin/reservations" element={<ManageRes />} />
                        <Route path="/admin/upcoming" element={<Upcoming />} />
                        <Route path="/edit-movie/:id" element={<EditMovie />} />
                    </Routes>
                </HashRouter>
        </AuthProvider>
    );
};

function App() {
    return (
        <div className="App">
            <Wrapper />
        </div>
    );
}

export default App;
