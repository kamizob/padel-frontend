import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface ScheduleResponse {
    courtId: string;
    courtName: string;
    slots: string[];
}

export default function CourtSchedule() {
    const { courtId } = useParams();
    const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const today = new Date().toISOString().split("T")[0];
        return today;
    });

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // 🕐 Užkraunam tvarkaraštį kai pasikeičia aikštelė arba data
    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/schedule/${courtId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setSchedule(res.data))
            .catch((err) => console.error("Failed to load schedule:", err));
    }, [courtId, selectedDate]);

    const handleSlotClick = (slot: string) => {
        alert(`You selected slot: ${slot} on ${selectedDate}`);
        // 3 iteracijoje čia bus rezervacijos API call
    };

    if (!schedule) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <p>Loading schedule...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{schedule.courtName} 🕒</h2>

                {/* 🗓️ Kalendorius viršuje */}
                <div style={{ marginBottom: "15px" }}>
                    <label
                        htmlFor="date"
                        style={{
                            marginRight: "10px",
                            fontSize: "0.95rem",
                            color: "#b2becd",
                        }}
                    >
                        Select Date:
                    </label>
                    <input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="auth-input"
                        style={{ maxWidth: "200px" }}
                    />
                </div>

                {/* 🎾 Laiko slotai */}
                <div className="slots-grid">
                    {schedule.slots.map((s, index) => (
                        <button
                            key={index}
                            className="slot-button"
                            onClick={() => handleSlotClick(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => navigate("/courts")}
                    className="auth-button"
                    style={{ marginTop: "20px" }}
                >
                    Back to Courts
                </button>
            </div>
        </div>
    );
}
