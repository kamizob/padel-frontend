import { useState } from "react";
import { signUp } from "../api/auth";

export default function SignUp() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateFront = (): string | null => {
        if (!form.firstName.trim()) return "First name is required";
        if (!form.lastName.trim()) return "Last name is required";
        if (!/\S+@\S+\.\S+/.test(form.email)) return "Invalid email format";
        if (form.password.length < 6) return "Password must be at least 6 characters";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const frontError = validateFront();
        if (frontError) {
            setMessage(frontError);
            setIsError(true);
            return;
        }

        try {
            const response = await signUp(form);
            setMessage(response.message);
            setIsError(false);
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: Record<string, string> } };
            const errorData = axiosError.response?.data;

            if (errorData) {
                const firstError =
                    errorData.email ||
                    errorData.password ||
                    errorData.firstName ||
                    errorData.lastName ||
                    errorData.error ||
                    "Validation error";
                setMessage(firstError);
            } else {
                setMessage("Server error – please try again later");
            }
            setIsError(true);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit} noValidate>
                    <input
                        className="auth-input"
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={form.firstName}
                        onChange={handleChange}
                    />
                    <input
                        className="auth-input"
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={form.lastName}
                        onChange={handleChange}
                    />
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
                        Register
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

                <p
                    style={{
                        marginTop: "15px",
                        fontSize: "0.9rem",
                        color: "#b2becd",
                    }}
                >
                    Already have an account?{" "}
                    <a href="/login" style={{ color: "#5ce1e6", textDecoration: "none" }}>
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}
