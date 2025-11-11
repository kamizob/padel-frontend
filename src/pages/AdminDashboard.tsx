import { useEffect, useState } from "react";
import axios from "axios";


// Tipai
interface Court {
    id: string;
    name: string;
    location: string;
    isActive: boolean;
    openingTime: string;
    closingTime: string;
    slotMinutes: number;
}

interface PagedResponse {
    courts: Court[];
    page: number;
    totalPages: number;
    totalCourts: number;
}

// Toast komponentas
function Toast({ message, type }: { message: string; type: "success" | "error" }) {
    return (
        <div className={`toast ${type === "success" ? "toast-success" : "toast-error"}`}>
            {message}
        </div>
    );
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
    const [editCourt, setEditCourt] = useState<Court | null>(null);
    const [editForm, setEditForm] = useState({
        openTime: "",
        closeTime: "",
        slotMinutes: 60,
    });

    const [formError, setFormError] = useState("");
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(
        null
    );

    // 🧭 Puslapiavimas
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = localStorage.getItem("token");

    // ⏳ Auto išjungimas toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // 🔄 Užkrauna aikšteles su puslapiavimu
    const loadCourts = async (newPage = page) => {
        try {
            const res = await axios.get<PagedResponse>(
                `http://localhost:8080/api/courts/paged?page=${newPage}&size=5`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCourts(res.data.courts);
            setPage(res.data.page);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Failed to fetch courts:", err);
            setToast({ message: "❌ Failed to load courts.", type: "error" });
        }
    };

    useEffect(() => {
        void loadCourts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 🧩 Kurti naują aikštelę
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");
        try {
            await axios.post("http://localhost:8080/api/courts", form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setToast({ message: "✅ Court created successfully!", type: "success" });
            setForm({
                name: "",
                location: "",
                openTime: "08:00",
                closeTime: "22:00",
                slotMinutes: 60,
            });
            await loadCourts(1);
        } catch (error: unknown) {
            let backendMsg = "❌ Failed to create court.";

            if (axios.isAxiosError(error)) {
                backendMsg =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    backendMsg;
            }

            setToast({ message: backendMsg, type: "error" });
        }

    };

    // 🔘 Aktyvumo keitimas
    const handleToggleActive = async (courtId: string, isActive: boolean) => {
        try {
            await axios.patch(
                `http://localhost:8080/api/courts/${courtId}`,
                { isActive: !isActive },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setToast({
                message: `Court ${!isActive ? "activated" : "deactivated"} successfully!`,
                type: "success",
            });
            await loadCourts(page);
        } catch {
            setToast({ message: "❌ Failed to update court status.", type: "error" });
        }
    };

    // 🕓 Redagavimo funkcijos
    const handleEditClick = (court: Court) => {
        setEditCourt(court);
        setEditForm({
            openTime: court.openingTime,
            closeTime: court.closingTime,
            slotMinutes: court.slotMinutes,
        });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSaveEdit = async () => {
        if (!editCourt) return;
        try {
            await axios.patch(
                `http://localhost:8080/api/courts/${editCourt.id}/schedule`,
                editForm,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setToast({ message: "✅ Schedule updated successfully!", type: "success" });
            setEditCourt(null);
            await loadCourts(page);
        } catch {
            setToast({ message: "❌ Failed to update schedule.", type: "error" });
        }
    };

    // 🧭 Pagination valdymas
    const handleNextPage = () => {
        if (page < totalPages) loadCourts(page + 1);
    };
    const handlePrevPage = () => {
        if (page > 1) loadCourts(page - 1);
    };

    return (
        <div className="auth-container">
            <div className="admin-grid">
                {/* Kairė pusė – pridėjimo forma */}
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
                        <p style={{ color: "#ff4d4d", marginTop: "10px", fontWeight: "bold", textAlign: "center" }}>
                            {formError}
                        </p>
                    )}

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
                                <button
                                    onClick={() => handleEditClick(c)}
                                    className="toggle-btn"
                                    style={{
                                        backgroundColor: "#5ce1e6",
                                        marginTop: "6px",
                                    }}
                                >
                                    Edit Schedule
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* 🧭 Pagination */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "20px",
                            gap: "10px",
                        }}
                    >
                        <button
                            className="auth-button"
                            style={{
                                background:
                                    page === 1
                                        ? "gray"
                                        : "linear-gradient(135deg, #5ce1e6, #00c853)",
                                cursor: page === 1 ? "not-allowed" : "pointer",
                                opacity: page === 1 ? 0.6 : 1,
                            }}
                            disabled={page === 1}
                            onClick={handlePrevPage}
                        >
                            ⬅ Prev
                        </button>

                        <button
                            className="auth-button"
                            style={{
                                background:
                                    page === totalPages
                                        ? "gray"
                                        : "linear-gradient(135deg, #5ce1e6, #00c853)",
                                cursor: page === totalPages ? "not-allowed" : "pointer",
                                opacity: page === totalPages ? 0.6 : 1,
                            }}
                            disabled={page === totalPages}
                            onClick={handleNextPage}
                        >
                            Next ➡
                        </button>
                    </div>


                </div>
            </div>

            {/* 🕓 Modal Redagavimui */}
            {editCourt && (
                <div className="modal-overlay" onClick={() => setEditCourt(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Edit Schedule – {editCourt.name}</h3>

                        <input
                            className="auth-input"
                            type="time"
                            name="openTime"
                            value={editForm.openTime}
                            onChange={handleEditChange}
                        />
                        <input
                            className="auth-input"
                            type="time"
                            name="closeTime"
                            value={editForm.closeTime}
                            onChange={handleEditChange}
                        />
                        <input
                            className="auth-input"
                            type="number"
                            name="slotMinutes"
                            value={editForm.slotMinutes}
                            onChange={handleEditChange}
                            min={15}
                        />

                        <button
                            className="auth-button"
                            style={{
                                background: "linear-gradient(135deg, #00c853, #5ce1e6)",
                                marginTop: "10px",
                            }}
                            onClick={handleSaveEdit}
                        >
                            💾 Save Changes
                        </button>

                        <button
                            className="auth-button"
                            style={{
                                background: "linear-gradient(135deg, #ff4b2b, #ff416c)",
                                marginTop: "10px",
                            }}
                            onClick={() => setEditCourt(null)}
                        >
                            ✖ Close
                        </button>
                    </div>
                </div>
            )}

            {/* 🔔 Toast pranešimas */}
            {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
    );
}
