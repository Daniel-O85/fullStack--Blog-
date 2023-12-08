import React from "react";
import Login from "../Login/Login";

export default function Oops() {
    setTimeout(() => {
        window.location.href = "http://localhost:3000";
    }, 3500);
    return (
        <div className="logout">
            <h3>Oops, es ist etwas schiefgelaufen</h3>
            <p>Benutzername oder Kennwort falsch!!!</p>
            <hr />
        </div>
    )
}