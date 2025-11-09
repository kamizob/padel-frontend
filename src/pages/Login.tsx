import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setMessage("Please fill in all fields");
            setIsError(true);
            return;
        }

        try {
            const response = await login(form);
            localStorage.setItem("token", response.token);
            setMessage("✅ Login successful! Redirecting...");
            setIsError(false);
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: Record<string, string> } };
            const errorData = axiosError.response?.data;

            if (errorData?.error) setMessage(errorData.error);
            else setMessage("❌ Invalid credentials or server error.");
            setIsError(true);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        className="auth-input"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <input
                        className="auth-input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                    />
                    <button className="auth-button" type="submit">
                        Login
                    </button>
                </form>
                {message && (
                    <p
                        className="auth-message"
                        style={{
                            fontWeight: "bold",
                            color: isError ? "#ff4d4d" : "#00e676",
                        }}
                    >
                        {message}
                    </p>
                )}
                <p style={{ marginTop: "15px", fontSize: "0.9rem", color: "#b2becd" }}>
                    Don’t have an account?{" "}
                    <a href="/signup" style={{ color: "#5ce1e6", textDecoration: "none" }}>
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}
