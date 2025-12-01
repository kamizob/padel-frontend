import { useEffect, useState, useCallback } from "react";
import axios from "axios";

interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isVerified: boolean;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [form, setForm] = useState({ firstName: "", lastName: "", newPassword: "" });
    const [message, setMessage] = useState("");
    const [messageId, setMessageId] = useState(0);
    const [isError, setIsError] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const token = localStorage.getItem("token");

    const loadProfile = useCallback(async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/user/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfile(res.data);
            setForm({
                firstName: res.data.firstName || "",
                lastName: res.data.lastName || "",
                newPassword: "",
            });
            setIsChanged(false);
        } catch {
            setMessage("❌ Failed to load profile");
            setIsError(true);
            setMessageId(prev => prev + 1); //  kad garantuotai rerenderintų
        }
    }, [token]);

    useEffect(() => {
        void loadProfile();
    }, [loadProfile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setIsChanged(true);
    };

    const validate = () => {
        if (form.firstName.trim() && form.firstName.length < 2) return "First name too short";
        if (form.lastName.trim() && form.lastName.length < 2) return "Last name too short";
        if (form.newPassword.trim() && form.newPassword.length < 6)
            return "Password must be at least 6 characters";
        return null;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const validationError = validate();
        if (validationError) {
            setMessage(`❌ ${validationError}`);
            setIsError(true);
            setMessageId(prev => prev + 1); // priverčiam atsinaujinti
            return;
        }

        const payload: Record<string, string> = {};
        if (profile && form.firstName.trim() && form.firstName.trim() !== profile.firstName)
            payload.firstName = form.firstName.trim();
        if (profile && form.lastName.trim() && form.lastName.trim() !== profile.lastName)
            payload.lastName = form.lastName.trim();
        if (form.newPassword.trim()) payload.newPassword = form.newPassword.trim();


        try {
            await axios.patch("http://localhost:8080/api/user/profile", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMessage("✅ Profile updated successfully!");
            setIsError(false);
            setIsChanged(false);
            setMessageId(prev => prev + 1);
            await loadProfile();
        } catch (err: unknown) {
            console.error(err);
            setIsError(true);

            let backendMsg = "❌ Failed to update profile.";
            if (typeof err === "object" && err !== null && "response" in err) {
                const response = (err as any).response;
                backendMsg = response?.data?.message || response?.data?.error || backendMsg;
            }

            setMessage(backendMsg);
            setMessageId(prev => prev + 1);
        }
    };

    if (!profile) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ maxWidth: "450px" }}>
                <h2>My Profile 👤</h2>
                <p style={{ color: "#b2becd" }}>Email: {profile.email}</p>
                <p style={{ color: "#b2becd" }}>
                    Role: {profile.role} | {profile.isVerified ? "✅ Verified" : "❌ Not Verified"}
                </p>

                <form onSubmit={handleSave}>
                    <input
                        className="auth-input"
                        name="firstName"
                        placeholder="First name"
                        value={form.firstName}
                        onChange={handleChange}
                    />
                    <input
                        className="auth-input"
                        name="lastName"
                        placeholder="Last name"
                        value={form.lastName}
                        onChange={handleChange}
                    />
                    <input
                        className="auth-input"
                        name="newPassword"
                        type="password"
                        placeholder="New password (optional)"
                        value={form.newPassword}
                        onChange={handleChange}
                    />
                    <button
                        className="auth-button"
                        type="submit"
                        disabled={!isChanged}
                        style={{
                            opacity: isChanged ? 1 : 0.6,
                            cursor: isChanged ? "pointer" : "not-allowed",
                        }}
                    >
                        💾 Save Changes
                    </button>
                </form>

                {message && (
                    <div
                        key={messageId}
                        className={`toast ${isError ? "toast-error" : "toast-success"}`}
                        style={{
                            marginTop: "20px",
                            fontWeight: "bold",
                        }}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
