import { useEffect, useState } from "react";
import axios from "axios";

interface MyBooking {
    id: string;
    courtId: string;
    courtName: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
}

export default function MyBookings() {
    const [bookings, setBookings] = useState<MyBooking[]>([]);
    const [message, setMessage] = useState("");
    const token = localStorage.getItem("token");

    // 🔄 Užkrauna vartotojo rezervacijas
    const loadBookings = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/bookings/my", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(res.data);
            setMessage("");
        } catch (err) {
            console.error("Failed to load bookings:", err);
            setMessage("❌ Failed to load your reservations.");
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    // ⏰ Gražus laiko formatas
    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: "700px" }}>
                <h2>My Reservations 🎾</h2>
                <p style={{ color: "#b2becd", marginBottom: "15px" }}>
                    View your upcoming bookings
                </p>

                {message && (
                    <p
                        style={{
                            color: message.includes("❌") ? "#ff4d4d" : "#00e676",
                            fontWeight: "bold",
                        }}
                    >
                        {message}
                    </p>
                )}

                {bookings.length === 0 ? (
                    <p style={{ color: "#b2becd" }}>No reservations found.</p>
                ) : (
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: "15px",
                            fontSize: "0.95rem",
                        }}
                    >
                        <thead>
                        <tr style={{ color: "#5ce1e6", textAlign: "left" }}>
                            <th style={{ paddingBottom: "8px" }}>Court</th>
                            <th style={{ paddingBottom: "8px" }}>Start</th>
                            <th style={{ paddingBottom: "8px" }}>End</th>
                            <th style={{ paddingBottom: "8px" }}>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookings.map((b) => (
                            <tr key={b.id} style={{ borderBottom: "1px solid #2d333b" }}>
                                <td style={{ padding: "8px 0" }}>{b.courtName}</td>
                                <td style={{ padding: "8px 0" }}>{formatDateTime(b.startTime)}</td>
                                <td style={{ padding: "8px 0" }}>{formatDateTime(b.endTime)}</td>
                                <td
                                    style={{
                                        padding: "8px 0",
                                        color: b.isActive ? "#00e676" : "#ff4d4d",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {b.isActive ? "Active" : "Cancelled"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                <button
                    onClick={() => (window.location.href = "/courts")}
                    className="auth-button"
                    style={{
                        marginTop: "25px",
                        background: "linear-gradient(135deg, #5ce1e6, #00c853)",
                    }}
                >
                    Back to Courts
                </button>
            </div>
        </div>
    );
}
