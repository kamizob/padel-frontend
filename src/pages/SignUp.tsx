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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();



        try {
            const response = await signUp(form);
            setMessage(response.message);
        }  catch (err: unknown) {
        if (err instanceof Error) {
            console.error("Unexpected error:", err.message);
        }

        const axiosError = err as { response?: { data?: Record<string, string> } };
        const errorData = axiosError.response?.data;

        if (errorData) {
            if (errorData.email) setMessage(errorData.email);
            else if (errorData.password) setMessage(errorData.password);
            else if (errorData.firstName) setMessage(errorData.firstName);
            else if (errorData.lastName) setMessage(errorData.lastName);
            else if (errorData.error) setMessage(errorData.error);
            else setMessage("Unknown validation error");
        } else {
            setMessage("Server error – please try again later");
        }
    }

};

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        className="auth-input"
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="auth-input"
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                    />
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
                        Register
                    </button>
                </form>
                <p className="auth-message">{message}</p>

                <p
                    style={{
                        marginTop: "15px",
                        fontSize: "0.9rem",
                        color: "#b2becd",
                    }}
                >
                    Already have an account?{" "}
                    <a
                        href="/login"
                        style={{ color: "#5ce1e6", textDecoration: "none" }}
                    >
                        Log in
                    </a>
                </p>
            </div>
        </div>
    );
}
