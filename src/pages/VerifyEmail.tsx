import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyEmail } from "../api/auth";

export default function VerifyEmail() {
    const [params] = useSearchParams();
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = params.get("token");
        if (token) {
            verifyEmail(token)
                .then((res) => setMessage(res.message))
                .catch(() => setMessage("Verification failed."));
        }
    }, []);

    return (
        <div className="p-4">
            <h2>{message || "Verifying your email..."}</h2>
        </div>
    );
}
