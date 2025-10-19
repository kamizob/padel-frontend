export default function Dashboard() {
    const token = localStorage.getItem("token");

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome 🎾</h2>
                {token ? (
                    <p>You are logged in with a valid token!</p>
                ) : (
                    <p>You are not logged in.</p>
                )}
                <button
                    className="auth-button"
                    style={{ marginTop: "20px" }}
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
