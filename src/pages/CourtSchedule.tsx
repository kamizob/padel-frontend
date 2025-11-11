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
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [message, setMessage] = useState<string>("");

    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // 🕐 Užkraunam tvarkaraštį
    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/schedule/${courtId}?date=${selectedDate}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setSchedule(res.data))
            .catch((err) => console.error("Failed to load schedule:", err));
    }, [courtId, selectedDate]);

    const handleSlotClick = (slot: string) => {
        setSelectedSlot(slot);
        setMessage(`Selected slot: ${slot}`);
    };

    const handleReserve = async () => {
        if (!selectedSlot) {
            setMessage("❌ Please select a time slot first.");
            return;
        }

        try {
            const [start, end] = selectedSlot.split(" - ");
            const startTime = `${selectedDate}T${start}:00`;
            const endTime = `${selectedDate}T${end}:00`;

            await axios.post(
                "http://localhost:8080/api/bookings",
                { courtId, startTime, endTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage("✅ Booking created successfully!");
            setSelectedSlot(null);

            // 🔄 Atnaujinam laisvų laikų sąrašą
            const res = await axios.get(
                `http://localhost:8080/api/schedule/${courtId}?date=${selectedDate}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSchedule(res.data);
        } catch (err) {
            console.error("Booking failed:", err);
            setMessage("❌ Failed to create booking. Please try again.");
        }
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

                {/* 📅 Pasirinkti datą */}
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
                            style={{
                                backgroundColor:
                                    s === selectedSlot ? "#5ce1e6" : "#0d1117",
                                color: s === selectedSlot ? "#0b0f14" : "#e6edf3",
                                border:
                                    s === selectedSlot
                                        ? "2px solid #5ce1e6"
                                        : "1px solid #5ce1e6",
                            }}
                            onClick={() => handleSlotClick(s)}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* 💬 Žinutė / klaida */}
                {message && (
                    <p
                        style={{
                            color: message.includes("❌") ? "#ff4d4d" : "#00e676",
                            fontWeight: "bold",
                            marginTop: "15px",
                        }}
                    >
                        {message}
                    </p>
                )}

                {/* 🔘 Rezervavimo mygtukas */}
                <button
                    className="auth-button"
                    style={{
                        marginTop: "20px",
                        background:
                            "linear-gradient(135deg, #00c853, #5ce1e6)",
                        opacity: selectedSlot ? 1 : 0.5,
                        cursor: selectedSlot ? "pointer" : "not-allowed",
                    }}
                    onClick={handleReserve}
                    disabled={!selectedSlot}
                >
                    Reserve Selected Time
                </button>

                {/* 🔙 Grįžti atgal */}
                <button
                    onClick={() => navigate("/courts")}
                    className="auth-button"
                    style={{
                        marginTop: "10px",
                        background:
                            "linear-gradient(135deg, #ff4b2b, #ff416c)",
                    }}
                >
                    Back to Courts
                </button>
            </div>
        </div>
    );
}
