import { Outlet, Link } from "react-router-dom";
import Login from "../Login/Login";


import "./Menu.css";

export default function Menu() {
    // Überprüfen, ob der Wert für "eingeloggt" im localStorage vorhanden ist
    const eingeloggt = localStorage.getItem("eingeloggt");


    // Wenn "eingeloggt" nicht existiert oder leer oder "0" ist, zeige die Login-Komponente
    if (!eingeloggt || eingeloggt === "0" || eingeloggt === "") {
        return <Login />;
    } else if (eingeloggt === "1")
        return (
            <>
                <header>
                    <ul>
                        <li>
                            <img src={"https://cdn-icons-png.flaticon.com/128/2276/2276931.png?uid=R103053098&ga=GA1.1.611708852.1684318471&track=ais"} alt={"Logo"} />

                        </li>
                        <li>
                            <Link to="/">Meine Daten</Link>
                        </li>
                        <li>
                            <Link to="/blog">Mein Blog</Link>
                        </li>
                        <li>
                            <Link to="/finden">Freunde finden</Link>
                        </li>
                        <li>
                            <Link to="/freunde">Meine Freunde</Link>
                        </li>
                        <li>
                            <Link to="/logout">Ausloggen</Link>
                        </li>
                    </ul>

                </header>
                <main>
                    <Outlet />
                </main>
                <footer >
                    <p>Copyright&copy; by Daniel Ottinger</p>
                </footer>
            </>
        );
}
