import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import VerifySuccess from "./pages/VerifySuccess";
import VerifyFailed from "./pages/VerifyFailed";
import Dashboard from "./pages/Dashboard";
import CourtsList from "./pages/CourtsList";
import CourtSchedule from "./pages/CourtSchedule";
import './App.css';
import AdminDashboard from "./pages/AdminDashboard";
import MyBookings from "./pages/MyBookings";
import Navbar from "./components/NavBar";

function AppContent() {
    const location = useLocation();
    const hideNavbarRoutes = ["/signup", "/login", "/verify-success", "/verify-failed"];

    return (
        <>
            {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
            <div style={{ paddingTop: hideNavbarRoutes.includes(location.pathname) ? "0" : "70px" }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/signup" />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/verify-success" element={<VerifySuccess />} />
                    <Route path="/verify-failed" element={<VerifyFailed />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/courts" element={<CourtsList />} />
                    <Route path="/courts/:courtId/schedule" element={<CourtSchedule />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/bookings/my" element={<MyBookings />} />
                </Routes>
            </div>
        </>
    );
}

export default function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}
