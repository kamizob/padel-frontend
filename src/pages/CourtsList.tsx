import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

interface Court {
    id: string;
    name: string;
    location: string;
    openingTime: string;
    closingTime: string;
}

interface PagedResponse {
    courts: Court[];
    page: number;
    totalPages: number;
    totalCourts: number;
}

export default function CourtsList() {
    const [courts, setCourts] = useState<Court[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const loadCourts = async (newPage = 1) => {
        try {
            const res = await axios.get<PagedResponse>(
                `http://localhost:8080/api/courts/active/paged?page=${newPage}&size=5`,
                {headers: {Authorization: `Bearer ${token}`}}
            );
            setCourts(res.data.courts);
            setPage(res.data.page);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Failed to load courts:", err);
        }
    };

    useEffect(() => {
        void loadCourts(1);
    }, []);

    const handleNextPage = () => {
        if (page < totalPages) loadCourts(page + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) loadCourts(page - 1);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Available Courts 🎾</h2>

                {courts.length === 0 ? (
                    <p>No active courts found.</p>
                ) : (
                    <>
                        <ul style={{textAlign: "left", listStyle: "none", padding: 0}}>
                            {courts.map((c) => (
                                <li
                                    key={c.id}
                                    style={{
                                        marginBottom: "12px",
                                        backgroundColor: "#0d1117",
                                        padding: "10px",
                                        borderRadius: "10px",
                                    }}
                                >
                                    <strong>{c.name}</strong> — {c.location}
                                    <br/>
                                    {c.openingTime}–{c.closingTime}
                                    <br/>
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
                                            fontWeight: "bold",
                                        }}
                                    >
                                        View Schedule
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Pagination */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: "15px",
                                gap: "10px",
                            }}
                        >
                            <button
                                className="auth-button"
                                disabled={page === 1}
                                onClick={handlePrevPage}
                                style={{
                                    opacity: page === 1 ? 0.5 : 1,
                                    cursor: page === 1 ? "not-allowed" : "pointer",
                                }}
                            >
                                ⬅ Prev
                            </button>

                            <span style={{color: "#b2becd"}}>
                                Page {page} of {totalPages}
                            </span>

                            <button
                                className="auth-button"
                                disabled={page === totalPages}
                                onClick={handleNextPage}
                                style={{
                                    opacity: page === totalPages ? 0.5 : 1,
                                    cursor: page === totalPages ? "not-allowed" : "pointer",
                                }}
                            >
                                Next ➡
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
