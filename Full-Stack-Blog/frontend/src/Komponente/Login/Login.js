import React, { useEffect, useState } from "react";
import Willkommen from "../Willkommen/Willkommen";
import Oops from "../Oops/Oops";
import "./Login.css";

export default function Login() {
    // login
    const [loginBenutzer, loginBenutzerUpdate] = useState(null);
    const [loginKennwort, loginKennwortUpdate] = useState(null);
    // registrieren
    const [regBenutzer, regBenutzerUpdate] = useState(null);
    const [regVorname, regVornameUpdate] = useState(null);
    const [regNachname, regNachnameUpdate] = useState(null);
    const [regKennwort, regKennwortUpdate] = useState(null);
    // Fehlermeldung
    const [fehlermeldung, fehlermeldungUpdate] = useState("");

    //---//
    const [ergebnis, ergebnisUpdate] = useState("");
    //---//
    const [reloadMe, reloadMeUpload] = useState(null);

    function readTextFromServer(u, cb) {
        // Anfrage an den Server schicken
        window.fetch(u)
            // Antwort erhalten und als Text weiterreichen
            .then(rohdaten => rohdaten.text())
            // Die weitergereichte Information an die Callback-Funktion übergeben
            .then(daten => cb(daten))
            // Falls ein Fehler auftritt, diesen auf der Konsole ausgeben
            .catch((fehler) => console.error(fehler));
    }

    function zeigeFehlermeldung(meldung) {
        // Zeige die Fehlermeldung an
        fehlermeldungUpdate(meldung);
    }

    function verbergeFehlermeldung() {
        // Verberge die Fehlermeldung
        fehlermeldungUpdate("");
    }

    function anmeldung() {
        readTextFromServer(
            "http://localhost:3344/login/" + loginBenutzer + "/" + loginKennwort,
            (antwort) => {
                localStorage.setItem("eingeloggt", antwort === "0" ? "0" : "1");
                localStorage.setItem("kontoNr", antwort);
                localStorage.setItem("willkommen", "1");
                ergebnisUpdate(antwort);
                reloadMeUpload(
                    () => {
                        window.setTimeout(
                            () => {
                                window.location.href = "http://localhost:3000/";
                            },
                            2300
                        );
                    }
                );
            }
        );
    }

    function registrieren() {
        const objekt = {
            Vorname: regVorname,
            Nachname: regNachname,
            Benutzer: regBenutzer,
            Kennwort: regKennwort
        };

        // Überprüfung der Eingabefelder
        if (regVorname == null || regVorname === "") {
            zeigeFehlermeldung("Bitte Vorname eingeben");
        } else if (regNachname == null || regNachname === "") {
            zeigeFehlermeldung("Bitte Nachname eingeben");
        } else if (regBenutzer == null || regBenutzer === "") {
            zeigeFehlermeldung("Bitte Benutzer eingeben");
        } else if (regKennwort == null || regKennwort === "") {
            zeigeFehlermeldung("Bitte Kennwort eingeben");
        } else {

            // Wenn alle Felder ausgefüllt sind, sende die Daten an den Server
            readTextFromServer(
                "http://localhost:3344/registrieren/" + JSON.stringify(objekt),
                (e) => {
                    regVornameUpdate("");
                    regNachnameUpdate("");
                    regBenutzerUpdate("");
                    regKennwortUpdate("");
                    // Setze alle Input-Felder zurück
                    const feld = document.getElementsByTagName("input");
                    for (let x = 2; x < feld.length; x++)
                        feld[x].value = "";

                    // Verstecke die Fehlermeldung
                    verbergeFehlermeldung();
                }
            );
        }
    }

    return (
        <>
            {ergebnis === "" ?
                <div className="login">

                    <h1>Daniels Food Blog</h1>

                    <div>
                        <h3>Einloggen</h3>
                        <input type="text" placeholder="Benutzer" onKeyUp={(e) => loginBenutzerUpdate(e.target.value)} />
                        <br />
                        <input type="password" placeholder="Kennwort" onKeyUp={(e) => loginKennwortUpdate(e.target.value)} />
                        <br />
                        <button onClick={() => anmeldung()}>Anmelden</button>
                    </div>
                    <br />
                    <div>
                        <h3>Registrieren</h3>
                        {/* Fehlermeldung anzeigen */}
                        {fehlermeldung && <div id="fehlermeldung"><h3 style={{ color: "red" }}>{fehlermeldung}</h3></div>}
                        <input type="text" placeholder="Vorname" onKeyUp={(e) => regVornameUpdate(e.target.value)} />
                        <br />
                        <input type="text" placeholder="Nachname" onKeyUp={(e) => regNachnameUpdate(e.target.value)} />
                        <br />
                        <input type="text" placeholder="Benutzer" onKeyUp={(e) => regBenutzerUpdate(e.target.value)} />
                        <br />
                        <input type="password" placeholder="Kennwort" onKeyUp={(e) => regKennwortUpdate(e.target.value)} />
                        <br />
                        <button onClick={() => registrieren()}>Registrieren</button>
                    </div>

                </div> : ergebnis === "0" ?
                    <Oops /> :
                    <>
                        <Willkommen />
                        {reloadMe}
                    </>
            }
        </>
    );
}
