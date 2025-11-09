import { useEffect, useState } from "react";
import axios from "axios";

interface Court {
    id: string;
    name: string;
    location: string;
    isActive: boolean;
    openingTime: string;
    closingTime: string;
    slotMinutes: number;
}

export default function AdminDashboard() {
    const [courts, setCourts] = useState<Court[]>([]);
    const [form, setForm] = useState({
        name: "",
        location: "",
        openTime: "08:00",
        closeTime: "22:00",
        slotMinutes: 60,
    });
    const [message, setMessage] = useState("");
    const token = localStorage.getItem("token");
    const [formError, setFormError] = useState("");


    const loadCourts = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/courts/all", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setCourts(res.data);
        } catch (err) {
            console.error("Failed to fetch courts:", err);
            setMessage("❌ Failed to load courts.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(""); // išvalom seną klaidą
        setMessage("");   // išvalom bendrą žinutę

        try {
            await axios.post("http://localhost:8080/api/courts", form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage("✅ Court created successfully!");
            setForm({
                name: "",
                location: "",
                openTime: "08:00",
                closeTime: "22:00",
                slotMinutes: 60,
            });
            loadCourts();
        } catch (err: unknown) {
            console.error("Failed to create court:", err);

            // bandome paimti klaidos pranešimą iš backend
            const axiosErr = err as { response?: { data?: Record<string, string> } };
            const errorData = axiosErr.response?.data;

            if (errorData) {
                if (errorData.error) setFormError(`❌ ${errorData.error}`);
                else if (errorData.message) setFormError(`❌ ${errorData.message}`);
                else setFormError("❌ Invalid input data.");
            } else {
                setFormError("❌ Failed to connect to server.");
            }
        }
    };


    const handleToggleActive = async (courtId: string, isActive: boolean) => {
        try {
            await axios.patch(
                `http://localhost:8080/api/courts/${courtId}`,
                { isActive: !isActive },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(`Court ${!isActive ? "activated" : "deactivated"} successfully!`);
            loadCourts();
        } catch (err) {
            console.error("Failed to update court:", err);
            setMessage("❌ Failed to update court status.");
        }
    };

    useEffect(() => {
        loadCourts();
    }, []);

    return (
        <div className="auth-container">
            <div className="admin-grid">
                {/*  Kairė pusė – forma */}
                <div className="admin-card">
                    <h2>Admin Panel ⚙️</h2>
                    <p style={{ color: "#b2becd" }}>Manage courts and schedules</p>

                    <form onSubmit={handleCreate} style={{ marginTop: "20px" }}>
                        <input
                            className="auth-input"
                            name="name"
                            placeholder="Court name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="auth-input"
                            name="location"
                            placeholder="Location"
                            value={form.location}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="auth-input"
                            name="openTime"
                            type="time"
                            value={form.openTime}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="auth-input"
                            name="closeTime"
                            type="time"
                            value={form.closeTime}
                            onChange={handleChange}
                            required
                        />
                        <input
                            className="auth-input"
                            name="slotMinutes"
                            type="number"
                            value={form.slotMinutes}
                            onChange={handleChange}
                            min={15}
                            required
                        />
                        <button className="auth-button" type="submit">
                            ➕ Add Court
                        </button>
                    </form>
                    {formError && (
                        <p
                            style={{
                                color: "#ff4d4d",
                                marginTop: "10px",
                                fontWeight: "bold",
                                textAlign: "center",
                            }}
                        >
                            {formError}
                        </p>
                    )}


                    {/*<p className="auth-message">{message}</p>*/}

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

                {/* Dešinė pusė – aikštelių sąrašas */}
                <div className="admin-card">
                    <h3>Existing Courts</h3>

                    {message && (
                        <p
                            style={{
                                color: message.includes("❌") ? "#ff4d4d" : "#00e676",
                                fontWeight: "bold",
                                marginBottom: "10px",
                                textAlign: "center",
                            }}
                        >
                            {message}
                        </p>
                    )}

                    <div className="courts-list">
                        {courts.map((c) => (
                            <div key={c.id} className="court-card">
                                <strong>{c.name}</strong> — {c.location}
                                <br />
                                {c.openingTime}–{c.closingTime} | Slot: {c.slotMinutes} min
                                <br />
                                Status:{" "}
                                <span
                                    style={{
                                        color: c.isActive ? "#00e676" : "#ff4d4d",
                                        fontWeight: "bold",
                                    }}
                                >
          {c.isActive ? "Active" : "Inactive"}
        </span>
                                <br />
                                <button
                                    onClick={() => handleToggleActive(c.id, c.isActive)}
                                    className="toggle-btn"
                                    style={{
                                        backgroundColor: c.isActive ? "#ff4d4d" : "#00e676",
                                    }}
                                >
                                    {c.isActive ? "Deactivate" : "Activate"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
