export default function VerifyFailed() {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 style={{ color: "#f85149" }}>❌ Verification Failed</h2>
                <p>This link may be invalid or expired.</p>
                <a href="/signup" style={{ color: "#58a6ff", textDecoration: "underline" }}>
                    Try Again
                </a>
            </div>
        </div>
    );
}
