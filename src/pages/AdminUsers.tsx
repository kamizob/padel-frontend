import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isVerified: boolean;
}

interface PagedUsersResponse {
    users: User[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export default function AdminUsers() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    let userRole = "";
    if (token) {
        try {
            const decoded = jwtDecode<{ role: string }>(token);
            userRole = decoded.role;
        } catch (e) {
            console.error("Token decode error:", e);
        }
    }
    useEffect(() => {
        if (userRole !== "SUPER_ADMIN") {
            navigate("/"); // arba "/courts"
        }
    }, [userRole]);

    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newRole, setNewRole] = useState("USER");

    const [message, setMessage] = useState("");

    // Load users
    const loadUsers = async (pageToLoad = 0) => {
        try {
            const res = await axios.get<PagedUsersResponse>(
                `http://localhost:8080/api/auth/users?page=${pageToLoad}&size=5`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUsers(res.data.users);
            setPage(res.data.page);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            setMessage("❌ Failed to load users.");
            console.error(err);
        }
    };

    useEffect(() => {
        loadUsers(0);
    }, []);

    const openRoleModal = (user: User) => {
        setSelectedUser(user);
        setNewRole(user.role);
    };

    const updateRole = async () => {
        if (!selectedUser) return;

        try {
            await axios.post(
                "http://localhost:8080/api/auth/role",
                {
                    userId: selectedUser.id,
                    newRole,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessage("✅ Role updated successfully!");
            setSelectedUser(null);
            await loadUsers(page);
        } catch (err: unknown) {
            let msg = "❌ Failed to update role.";

            if (axios.isAxiosError(err)) {
                msg = err.response?.data?.message || msg;
            }
            setMessage(msg);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: "700px", width: "100%", overflow: "hidden" }}>
                <h2>User Management 👥</h2>
                <p style={{ color: "#b2becd" }}>Manage user roles and verification status</p>

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

                {/* Table */}
                <table
                    style={{
                        width: "100%",
                        tableLayout: "auto",
                        marginTop: "20px",
                        borderCollapse: "collapse",
                        borderSpacing: "0 8px",
                        fontSize: "0.9rem",
                    }}
                >
                    <thead>
                    <tr style={{ color: "#5ce1e6" }}>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u) => (
                        <tr
                            key={u.id}
                            style={{
                                backgroundColor: "#151a1f",
                                borderRadius: "8px",
                            }}
                        >
                            <td style={{ padding: "10px" }}>{u.email}</td>
                            <td style={{ padding: "10px" }}>
                                {u.firstName} {u.lastName}
                            </td>

                            {/* ROLE BADGE */}
                            <td style={{ padding: "10px" }}>
                                    <span
                                        style={{
                                            padding: "4px 10px",
                                            borderRadius: "6px",
                                            fontWeight: "bold",
                                            color: "#fff",
                                            background:
                                                u.role === "USER"
                                                    ? "linear-gradient(135deg, #5ce1e6, #00c853)"
                                                    :"linear-gradient(135deg, #ff4b2b, #ff416c)" ,
                                        }}
                                    >
                                        {u.role}
                                    </span>
                            </td>

                            <td style={{ padding: "10px" }}>
                                {u.isVerified ? (
                                    <span style={{ color: "#00e676" }}>Verified</span>
                                ) : (
                                    <span style={{ color: "#ff4d4d" }}>Not verified</span>
                                )}
                            </td>

                            <td style={{ padding: "10px" }}>
                                <button
                                    onClick={() => openRoleModal(u)}
                                    className="auth-button"
                                    style={{
                                        whiteSpace: "nowrap",
                                        padding: "6px 12px",
                                        fontSize: "0.8rem",
                                    }}
                                >
                                    Change Role
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Pagination */}
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
                        disabled={page === 0}
                        onClick={() => loadUsers(page - 1)}
                        style={{
                            opacity: page === 0 ? 0.5 : 1,
                        }}
                    >
                        ⬅ Prev
                    </button>

                    <span style={{ color: "#b2becd" }}>
                        Page {page + 1} of {totalPages}
                    </span>

                    <button
                        className="auth-button"
                        disabled={page + 1 >= totalPages}
                        onClick={() => loadUsers(page + 1)}
                        style={{
                            opacity: page + 1 >= totalPages ? 0.5 : 1,
                        }}
                    >
                        Next ➡
                    </button>
                </div>
            </div>

            {/* Modal */}
            {selectedUser && (
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedUser(null)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "350px" }}
                    >
                        <h3>Change Role</h3>
                        <p style={{ color: "#b2becd" }}>
                            {selectedUser.email}
                        </p>

                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="auth-input"
                            style={{ marginTop: "10px" }}
                        >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                        </select>

                        <button
                            className="auth-button"
                            style={{
                                marginTop: "15px",
                                background: "linear-gradient(135deg, #00c853, #5ce1e6)",
                            }}
                            onClick={updateRole}
                        >
                            Save
                        </button>

                        <button
                            className="auth-button"
                            style={{
                                marginTop: "10px",
                                background: "linear-gradient(135deg, #ff4b2b, #ff416c)",
                            }}
                            onClick={() => setSelectedUser(null)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
