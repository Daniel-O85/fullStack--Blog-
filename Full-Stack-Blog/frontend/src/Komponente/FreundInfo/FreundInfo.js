import React, { useState, useEffect } from 'react';

export default function FreundInfo({ KontoNr }) {
    const [meineDaten, meineDatenUpdate] = useState({});

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

    function readTEXTFromServer(u, cb) {
        // Anfrage an den Server scihcken
        window.fetch(u)
            // Antwort erhalten und als Text weiterreichen
            .then(rohdaten => rohdaten.text())
            // Die weitergereichte Information an die Callback-Funktion übergeben
            .then(daten => cb(daten))
            // Falls ein Fehler aufteten sollte, diese auf der Konsole ausgegeben
            .catch((fehler) => console.error(fehler));
    }

    useEffect(
        () => {
            readJSONFromServer(
                "http://localhost:3344/freundinfo/" + KontoNr,
                (respond) => {
                    meineDatenUpdate({
                        Vorname: respond.Vorname,
                        Nachname: respond.Nachname,
                        Benutzer: respond.Benutzer,
                        EMail: respond.EMail
                    });
                }
            );
        }, [KontoNr]
    );

    return (
        <>
            <p>Vorname: {meineDaten.Vorname}</p>
            <p>Nachname: {meineDaten.Nachname}</p>
            <p>Benutzer: {meineDaten.Benutzer}</p>
            <p>E-Mail: {meineDaten.EMail}</p>
        </>
    )


}