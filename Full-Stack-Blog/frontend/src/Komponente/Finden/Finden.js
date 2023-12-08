import React, { useState } from 'react';
import "./Finden.css";

export default function Finden() {
    const [findFriend, setFindFriends] = useState([]);
    const [acountNr, acountNrUpdate] = useState(undefined);
    const [addFriend, setAddFriend] = useState("");

    //---//
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

    // suchen / anzeigen
    function searching(begriff) {
        let Konto;
        // *** //
        if (acountNr == undefined) {
            let KN = localStorage.getItem("kontoNr");
            Konto = KN;
            acountNrUpdate(KN);
        } else Konto = acountNr;
        // *** //
        readJSONFromServer(
            "http://localhost:3344/freunde/finden/" + Konto + "/" + begriff,
            (respond) => {
                const daten = [];
                // *** //
                respond.forEach((row) => {
                    daten.push(
                        <li key={row.id}>
                            <p>Vorname: {row.Vorname}</p>
                            <p>Nachname: {row.Nachname}</p>
                            <p>Benutzer: {row.Benutzer}</p>
                            <p>E-Mail: {row.EMail}</p>
                            <button onClick={() => annehmen(Konto, row.KontoNr)}>Annehmen</button>
                            <button onClick={() => verwerfen(Konto, row.KontoNr)}>Verwerfen</button>
                            <hr />
                        </li>
                    );
                });
                // *** //
                setFindFriends(daten);
            }
        );
    }

    function annehmen(k1, k2) {
        readTEXTFromServer(`http://localhost:3344/freundschaft/${k1}/${k2}`,
            (e) => {
                // Wenn die Anfrage erfolgreich war, zeige den Text im Paragraph an
                const paragraph = document.createElement("p");
                paragraph.classList.add("add-friend");
                paragraph.textContent = "Freund wurde hinzugefügt";
                document.body.appendChild(paragraph);
                setFindFriends();
                setAddFriend("");
            }
        );
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }

    // löschen
    function verwerfen(myId, friendId) {
        readTEXTFromServer(`http://localhost:3344/freund/entf/${myId}/${friendId}`,
            () => {
                // Wenn die Anfrage erfolgreich war, zeige den Text im Paragraph an
                const paragraph = document.createElement("p");
                paragraph.classList.add("delete-friend");
                paragraph.textContent = "Freund wurde gelöscht";
                document.body.appendChild(paragraph);
            });
        //
        setTimeout(() => {
            window.location.reload();
        }, 2000);
        setFindFriends();
    }

    //---//
    return (
        <div className='finden'>
            <div>
                <input type='search' placeholder='Freunde finden' onKeyUp={(e) => searching(e.target.value)} />
            </div>
            <ul>
                {findFriend}
            </ul>
        </div>
    )
}