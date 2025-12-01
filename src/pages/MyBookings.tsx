import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface MyBooking {
    id: string;
    courtId: string;
    courtName: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
}

interface CourtDetails {
    id: string;
    name: string;
    location: string;
    openingTime: string;
    closingTime: string;
    isActive: boolean;
}

export default function MyBookings() {
    const [bookings, setBookings] = useState<MyBooking[]>([]);
    const [message, setMessage] = useState("");
    const [selectedBooking, setSelectedBooking] = useState<MyBooking | null>(null);
    const [courtDetails, setCourtDetails] = useState<CourtDetails | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // Užkrauna vartotojo rezervacijas
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

    // Užkrauna konkrečios aikštelės informaciją
    const loadCourtDetails = async (courtId: string) => {
        try {
            const res = await axios.get(`http://localhost:8080/api/courts/${courtId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCourtDetails(res.data);
        } catch (err) {
            console.error("Failed to load court details:", err);
            setCourtDetails(null);
        }
    };

    useEffect(() => {
        void loadBookings();
    }, []);

    // Kai pasirenki rezervaciją, iš karto parsiunčia ir aikštelės info
    useEffect(() => {
        if (selectedBooking) {
            void loadCourtDetails(selectedBooking.courtId);
        }
    }, [selectedBooking]);

    // Laiko formatavimas
    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    };

    //  Atšaukimo funkcija
    const handleCancelBooking = async (bookingId: string) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            setIsLoading(true);
            await axios.patch(
                `http://localhost:8080/api/bookings/${bookingId}/cancel`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage("✅ Booking cancelled successfully!");
            setSelectedBooking(null);
            await loadBookings();
        } catch (err) {
            console.error("Failed to cancel booking:", err);
            setMessage("❌ Failed to cancel booking.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: "700px" }}>
                <h2>My Reservations 🎾</h2>
                <p style={{ color: "#b2becd", marginBottom: "15px" }}>
                    View and manage your bookings
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
                            <tr
                                key={b.id}
                                style={{
                                    borderBottom: "1px solid #2d333b",
                                    cursor: "pointer",
                                    transition: "background 0.2s ease",
                                }}
                                onClick={() => setSelectedBooking(b)}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "#151a1f")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                }
                            >
                                <td style={{ padding: "8px 0", color: "#5ce1e6", fontWeight: "bold" }}>
                                    {b.courtName}
                                </td>
                                <td style={{ padding: "8px 0" }}>{formatDateTime(b.startTime)}</td>
                                <td style={{ padding: "8px 0" }}>{formatDateTime(b.endTime)}</td>
                                <td
                                    style={{
                                        padding: "8px 0",
                                        color: !b.isActive
                                            ? "#ff4d4d"
                                            : new Date(b.endTime) < new Date()
                                                ? "#b2becd"
                                                : "#00e676",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {!b.isActive
                                        ? "Cancelled"
                                        : new Date(b.endTime) < new Date()
                                            ? "Finished"
                                            : "Active"}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                <button
                    onClick={() => navigate("/courts")}
                    className="auth-button"
                    style={{
                        marginTop: "25px",
                        background: "linear-gradient(135deg, #5ce1e6, #00c853)",
                    }}
                >
                    Back to Courts
                </button>
            </div>

            {/*  Modal su rezervacijos informacija */}
            {selectedBooking && (
                <div
                    className="modal-overlay"
                    onClick={() => {
                        setSelectedBooking(null);
                        setCourtDetails(null);
                    }}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: "#1e272e",
                            borderRadius: "12px",
                            padding: "25px",
                            width: "380px",
                            boxShadow: "0 0 15px rgba(0,0,0,0.3)",
                            textAlign: "center",
                        }}
                    >
                        <h3 style={{ color: "#5ce1e6" }}>{selectedBooking.courtName}</h3>
                        {courtDetails ? (
                            <p style={{ color: "#b2becd", marginTop: "10px" }}>
                                📍 <strong>Location:</strong> {courtDetails.location}
                                <br />
                                🕒 <strong>Working hours:</strong>{" "}
                                {courtDetails.openingTime}–{courtDetails.closingTime}
                            </p>
                        ) : (
                            <p style={{ color: "#b2becd" }}>Loading court details...</p>
                        )}

                        <p style={{ color: "#b2becd", marginTop: "10px" }}>
                            <strong>Start:</strong> {formatDateTime(selectedBooking.startTime)} <br />
                            <strong>End:</strong> {formatDateTime(selectedBooking.endTime)} <br />
                            <strong>Status:</strong>{" "}
                            <span
                                style={{
                                    color: !selectedBooking.isActive
                                        ? "#ff4d4d"
                                        : new Date(selectedBooking.endTime) < new Date()
                                            ? "#b2becd"
                                            : "#00e676",
                                    fontWeight: "bold",
                                }}
                            >
                                {!selectedBooking.isActive
                                    ? "Cancelled"
                                    : new Date(selectedBooking.endTime) < new Date()
                                        ? "Finished"
                                        : "Active"}
                            </span>
                        </p>

                        {/* Peržiūrėti aikštelės tvarkaraštį */}
                        <button
                            onClick={() => {
                                if (courtDetails?.isActive === false) {
                                    alert("⚠️ This court is currently inactive and cannot be viewed.");
                                    return;
                                }
                                navigate(`/courts/${selectedBooking.courtId}/schedule`);
                            }}
                            className="auth-button"
                            style={{
                                background:
                                    courtDetails?.isActive === false
                                        ? "gray"
                                        : "linear-gradient(135deg, #5ce1e6, #00c853)",
                                marginTop: "15px",
                                cursor: courtDetails?.isActive === false ? "not-allowed" : "pointer",
                                opacity: courtDetails?.isActive === false ? 0.6 : 1,
                            }}
                            disabled={courtDetails?.isActive === false}
                        >
                            🕓 View Court Schedule
                        </button>

                        {/* Atšaukti rezervaciją */}
                        {selectedBooking.isActive &&
                            new Date(selectedBooking.startTime) > new Date() && (
                                <button
                                    onClick={() => handleCancelBooking(selectedBooking.id)}
                                    className="auth-button"
                                    style={{
                                        background: "linear-gradient(135deg, #ff4b2b, #ff416c)",
                                        marginTop: "10px",
                                        opacity: isLoading ? 0.7 : 1,
                                        cursor: isLoading ? "wait" : "pointer",
                                    }}
                                    disabled={isLoading}
                                >
                                    🚫 Cancel Booking
                                </button>
                            )}

                        <button
                            onClick={() => {
                                setSelectedBooking(null);
                                setCourtDetails(null);
                            }}
                            className="auth-button"
                            style={{
                                background: "linear-gradient(135deg, #444, #222)",
                                marginTop: "10px",
                            }}
                        >
                            ✖ Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
