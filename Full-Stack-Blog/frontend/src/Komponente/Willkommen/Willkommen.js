import React, { useState, useEffect } from "react";
import "./Willkommen.css";

export default function Willkommen({ KontoNr }) {
    const [willkommen, willkommenUpdate] = useState(true);
    const [blogEintraege, blogEintraegeUpdate] = useState([]);
    const [acountNr, acountNrUpdate] = useState(undefined);
    const [userData, setUserData] = useState({
        Benutzer: "",
        Kennwort: "",
        Vorname: "",
        Nachname: "",
        Telefon: "",
        EMail: "",
        Adresse: "",
        PLZ: "",
        Ort: "",
    });

    function readJSONFromServer(u, cb) {
        // Anfrage an den Server schicken
        window.fetch(u)
            // Antwort erhalten und als JSON-Objekt weiterreichen
            .then(rohdaten => rohdaten.json())
            // Die weitergereichte Information an die Callback-Funktion übergeben
            .then(daten => cb(daten))
            // Falls ein Fehler aufteten sollte, diese auf der Konsole ausgegeben
            .catch((fehler) => console.error(fehler));
    }

    useEffect(
        () => {
            let K = localStorage.getItem("kontoNr");
            // *** //
            acountNrUpdate(K);
            // *** //
            if (K == "" || K == undefined || K == null)
                acountNrUpdate(KontoNr);
            // *** //
            let w = localStorage.getItem("willkommen");
            // *** //
            if (w == 1)
                window.setTimeout(
                    () => {
                        localStorage.setItem("willkommen", "0");
                        willkommenUpdate(false);
                    },
                    2300
                );
            else
                willkommenUpdate(false);

            // Daten des eingeloggten Benutzers aus der Datenbank abrufen
            readJSONFromServer(`http://localhost:3344/datenLesen/+` + K, (userData) => {
                console.log(userData);
                setUserData(userData);
            });

            // Blog-Einträge abrufen und in State speichern

            readJSONFromServer(
                "http://localhost:3344/blog/lastthree/" + K,
                (respond) => {
                    const abc = [];
                    // *** //
                    respond.forEach(
                        (zeile) => {
                            abc.push(
                                <>
                                    <h3>{zeile.Titel}</h3>
                                    <p>{zeile.Text}</p>
                                    <hr />
                                </>
                            );
                        }
                    );
                    // *** //
                    blogEintraegeUpdate(abc);
                }
            );
        }, [KontoNr]


    );
    const userDataUpdate = () => {
        const updatedData = {
            Benutzer: document.querySelector('input[placeholder="Benutzer"]').value,
            Kennwort: document.querySelector('input[placeholder="Kennwort"]').value,
            Vorname: document.querySelector('input[placeholder="Vorname"]').value,
            Nachname: document.querySelector('input[placeholder="Nachname"]').value,
            Telefon: document.querySelector('input[placeholder="Telefon"]').value,
            EMail: document.querySelector('input[placeholder="EMail"]').value,
            Adresse: document.querySelector('input[placeholder="Adresse"]').value,
            PLZ: document.querySelector('input[placeholder="PLZ"]').value,
            Ort: document.querySelector('input[placeholder="Ort"]').value,
            KontoNr: acountNr,
        };

        fetch("http://localhost:3344/datenSchreiben/" + JSON.stringify(updatedData))
            .then((response) => response.json())
            .then((data) => {
                console.log("Daten wurden erfolgreich aktualisiert", data);
            })
            .catch((error) => {
                console.error("Fehler beim Aktualisieren der Daten", error);
            });
    };



    return (
        <div className="willkommen">

            <div>
                <h3>Meine Daten</h3>
                <input placeholder="Benutzer" defaultValue={userData.Benutzer} />
                <br />
                <input placeholder="Kennwort" defaultValue={userData.Kennwort} />
                <br />
                <input placeholder="Vorname" defaultValue={userData.Vorname} />
                <br />
                <input placeholder="Nachname" defaultValue={userData.Nachname} />
                <br />
                <input placeholder="Telefon" defaultValue={userData.Telefon} />
                <br />
                <input placeholder="EMail" defaultValue={userData.EMail} />
                <br />
                <input placeholder="Adresse" defaultValue={userData.Adresse} />
                <br />
                <input placeholder="PLZ" defaultValue={userData.PLZ} />
                <br />
                <input placeholder="Ort" defaultValue={userData.Ort} />
                <br />
                <button onClick={userDataUpdate}>Ändern</button>
            </div>
            {willkommen === true ?
                <div>
                    <h3 className="willkommenMeldung">Willkommen :-)</h3>
                    <hr />
                </div>
                :
                <></>
            }
            <hr />
            <div>
                <h2>Letzte Blogeinträge</h2>
                {blogEintraege}
            </div>
        </div>
    )
}