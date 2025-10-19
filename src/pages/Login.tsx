import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login(form);
            localStorage.setItem("token", response.token);
            setMessage("Login successful! Redirecting...");
            setTimeout(() => navigate("/dashboard"), 1500); // 1.5s delay
        } catch {
            setMessage("Invalid credentials");
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
                        required
                    />
                    <input
                        className="auth-input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <button className="auth-button" type="submit">
                        Login
                    </button>
                </form>
                <p className="auth-message">{message}</p>
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
