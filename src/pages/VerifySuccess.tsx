export default function VerifySuccess() {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 style={{ color: "#2ea043" }}>✅ Email Verified</h2>
                <p>Your account is now active. You can log in.</p>
                <a href="/login" style={{ color: "#58a6ff", textDecoration: "underline" }}>
                    Go to Login
                </a>
            </div>
        </div>
    );
}
