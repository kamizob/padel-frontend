import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string; // email (subject)
    role: string; // from token claims
    exp: number; // expiration
}

export default function Dashboard() {
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const handleViewCourts = () => {
        window.location.href = "/courts";
    };

    const handleAdminPanel = () => {
        window.location.href = "/admin";
    };

    if (!token) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Welcome 🎾</h2>
                    <p>You are not logged in.</p>
                    <a href="/login" style={{ color: "#5ce1e6" }}>
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    // decode token
    let role = "";
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        role = decoded.role;
    } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
        return null;
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome 🎾</h2>
                <p>You are logged in as <strong>{role}</strong></p>

                <button
                    className="auth-button"
                    style={{ marginTop: "20px", background: "#5ce1e6" }}
                    onClick={handleViewCourts}
                >
                    View Courts
                </button>

                {role === "ADMIN" && (
                    <button
                        className="auth-button"
                        style={{
                            marginTop: "10px",
                            background: "linear-gradient(135deg, #ffea00, #ff9100)",
                        }}
                        onClick={handleAdminPanel}
                    >
                        Admin Panel
                    </button>
                )}

                <button
                    className="auth-button"
                    style={{
                        marginTop: "10px",
                        background: "linear-gradient(135deg, #ff4b2b, #ff416c)",
                    }}
                    onClick={handleLogout}
                >
                    Log out
                </button>
            </div>
        </div>
    );
}
