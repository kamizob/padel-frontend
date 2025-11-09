import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import VerifySuccess from "./pages/VerifySuccess";
import VerifyFailed from "./pages/VerifyFailed";
import Dashboard from "./pages/Dashboard";
import CourtsList from "./pages/CourtsList";
import CourtSchedule from "./pages/CourtSchedule";
import './App.css';
import AdminDashboard from "./pages/AdminDashboard.tsx";
import UserDashboard from "./pages/UserDashboard.tsx";

function App() {
    return (
        <Router>
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
                <Route path="/courts" element={<UserDashboard />} />

            </Routes>
        </Router>
    );
}

export default App;
