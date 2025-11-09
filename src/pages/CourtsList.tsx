import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CourtsList() {
    const [courts, setCourts] = useState<any[]>([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:8080/api/courts", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setCourts(res.data))
            .catch((err) => console.error("Failed to load courts:", err));
    }, []);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Available Courts 🎾</h2>
                {courts.length === 0 ? (
                    <p>No active courts found.</p>
                ) : (
                    <ul style={{ textAlign: "left" }}>
                        {courts.map((c) => (
                            <li key={c.id} style={{ marginBottom: "10px" }}>
                                <strong>{c.name}</strong> — {c.location}
                                <br />
                                {c.openingTime}–{c.closingTime}
                                <br />
                                <button
                                    onClick={() => navigate(`/courts/${c.id}/schedule`)}
                                    style={{
                                        marginTop: "6px",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        border: "none",
                                        backgroundColor: "#5ce1e6",
                                        color: "#0b0f14",
                                        cursor: "pointer",
                                    }}
                                >
                                    View Schedule
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
