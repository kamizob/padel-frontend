import { useState } from "react";
import { signUp } from "../api/auth";

export default function SignUp() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
    });
    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await signUp(form);
            setMessage(res.message);
        } catch {
            setMessage("Error during signup!");
        }
    };

    return (
        <div className="p-4">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input name="firstName" placeholder="First name" onChange={handleChange} />
                <input name="lastName" placeholder="Last name" onChange={handleChange} />
                <input name="email" placeholder="Email" onChange={handleChange} />
                <input name="password" placeholder="Password" type="password" onChange={handleChange} />
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
