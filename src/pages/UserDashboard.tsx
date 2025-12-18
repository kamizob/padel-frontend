import {useEffect, useState} from "react";
import axios from "axios";

interface Court {
    id: string;
    name: string;
    location: string;
    openingTime: string;
    closingTime: string;
    slotMinutes: number;
    isActive: boolean;
}

export default function UserDashboard() {
    const [courts, setCourts] = useState<Court[]>([]);
    const [message, setMessage] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchCourts = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/courts", {
                    headers: {Authorization: `Bearer ${token}`},
                });
                setCourts(res.data);
            } catch (err) {
                console.error(err);
                setMessage("Failed to load courts 😢");
            }
        };
        fetchCourts();
    }, []);

    return (
        <div className="auth-container">
            <div className="auth-card" style={{maxWidth: "600px"}}>
                <h2> Available Courts</h2>
                <p style={{color: "#b2becd"}}>Browse and see current schedules</p>

                {message && <p className="auth-message">{message}</p>}

                <ul style={{textAlign: "left", marginTop: "20px"}}>
                    {courts.map((c) => (
                        <li key={c.id} style={{marginBottom: "12px"}}>
                            <strong>{c.name}</strong> — {c.location} <br/>
                            Hours: {c.openingTime}–{c.closingTime} <br/>
                            Slot: {c.slotMinutes} min <br/>
                            <span
                                style={{
                                    color: c.isActive ? "#00e676" : "#ff4d4d",
                                    fontWeight: 600,
                                }}
                            >
                {c.isActive ? "Active" : "Inactive"}
              </span>
                        </li>
                    ))}
                </ul>

                <button
                    className="auth-button"
                    style={{
                        marginTop: "25px",
                        background: "linear-gradient(135deg, #ff4b2b, #ff416c)",
                    }}
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    }}
                >
                    Log out
                </button>
            </div>
        </div>
    );
}
