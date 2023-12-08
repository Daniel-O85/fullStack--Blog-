import React, { useEffect } from "react";

export default function Logout() {

    useEffect(() => {

        localStorage.setItem('eingeloggt', '0');
        localStorage.setItem("willkommen", "0");
        setTimeout(() => {
            window.location.href = "http://localhost:3000";
        }, 2000);
    }, []);

    return (
        <div className="logout">
            <h3>Du bist ausgeloggt</h3>
            <p>Vielen Dank für deinen Besuch. Bis Dann &#128512;</p>
        </div>
    )
};