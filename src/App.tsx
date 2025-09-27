import { useEffect, useState } from "react";

function App() {
    const [message, setMessage] = useState("Kraunasi...");

    useEffect(() => {
        fetch("/api/hello")
            .then(res => res.text())
            .then(setMessage)
            .catch(() => setMessage("Nepavyko pasiekti backend :("));
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Padelio rezervacijos sistema</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;
