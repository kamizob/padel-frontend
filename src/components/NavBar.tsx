import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string; // email
    role: string;
    exp: number;
}


export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    let userRole = "";
    if (token) {
        try {
            const decoded = jwtDecode<JwtPayload>(token);
            userRole = decoded.role;
        } catch (e) {
            console.error("Failed to decode token", e);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };


    return (
        <nav
            style={{
                width: "100%",
                backgroundColor: "#0b0f14",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 28px",
                borderBottom: "1px solid #1e272e",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 1000,
                flexWrap: "wrap",
            }}
        >
            {/* Kairė pusė – logotipas + nuorodos */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "30px",
                    flexWrap: "wrap",
                }}
            >
                {/* Logotipas */}
                <div
                    onClick={() => navigate("/courts")}
                    style={{
                        color: "#5ce1e6",
                        fontWeight: 700,
                        fontSize: "20px",
                        cursor: "pointer",
                        userSelect: "none",
                    }}
                >
                    Padel 🎾
                </div>

                {/* Nuorodos */}
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                    <NavLink to="/courts" label="Courts" />
                    <NavLink to="/bookings/my" label="My Reservations" />
                    <NavLink to="/profile" label="Profile" />
                    {userRole === "ADMIN" && <NavLink to="/admin" label="Admin Panel" />}
                </div>
            </div>

            {/* Dešinė pusė – logout */}
            {token && (
                <button
                    onClick={handleLogout}
                    style={{
                        background: "linear-gradient(135deg, #ff4b2b, #ff416c)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "6px 14px",
                        fontWeight: 500,
                        cursor: "pointer",
                        marginRight: "40px", // 👈 šiek tiek atitraukta nuo krašto
                        marginTop: "5px",
                        transition: "transform 0.2s ease, opacity 0.2s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                >
                    Logout
                </button>
            )}
        </nav>
    );
}

/* Atskiras komponentas nuorodoms su hover efektu */
function NavLink({ to, label }: { to: string; label: string }) {
    return (
        <Link
            to={to}
            style={{
                position: "relative",
                color: "#dfe6e9",
                textDecoration: "none",
                fontWeight: 500,
                fontSize: "16px",
                transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#5ce1e6")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#dfe6e9")}
        >
            {label}
            <span
                style={{
                    position: "absolute",
                    left: 0,
                    bottom: -2,
                    width: "100%",
                    height: "2px",
                    backgroundColor: "#5ce1e6",
                    transform: "scaleX(0)",
                    transformOrigin: "right",
                    transition: "transform 0.25s ease-out",
                }}
                className="hover-underline"
            ></span>
        </Link>
    );
}
