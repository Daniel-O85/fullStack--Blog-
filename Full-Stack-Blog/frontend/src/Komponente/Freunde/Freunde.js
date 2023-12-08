import React, { useState, useEffect } from 'react';
import FreundInfo from '../FreundInfo/FreundInfo';

export default function Freunde() {
    const [loadFriend, setLoadFriends] = useState([]);
    const [acountNr, acountNrUpdate] = useState(undefined);



    //
    function readJSONFromServer(u, cb) {
        // Anfrage an den Server scihcken
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
    //

    useEffect(() => {

        let Konto;
        // *** //
        if (acountNr == undefined) {
            let KN = localStorage.getItem("kontoNr");
            Konto = KN;
            acountNrUpdate(KN);
        } else Konto = acountNr;

        readJSONFromServer(
            "http://localhost:3344/freunde/auflisten/" + Konto,
            (respond) => {
                const daten = [];
                // *** //
                respond.forEach((row) => {
                    daten.push(
                        <li key={row.id}>
                            <FreundInfo KontoNr={row.FreundKontoNr} />
                            <button onClick={() => verwerfen(Konto, row.FreundKontoNr)}>Verwerfen</button>
                            <hr />
                        </li>
                    );
                });

                setLoadFriends(daten);

            }
        );

    }

        , []);


    // löschen
    function verwerfen(myId, friendId) {
        if (friendId) {
            readTEXTFromServer(`http://localhost:3344/freund/entf/${myId}/${friendId}`, () => {
                // Wenn die Anfrage erfolgreich war, zeige den Text im Paragraph an
                const paragraph = document.createElement("p");
                paragraph.classList.add("delete-friend");
                paragraph.textContent = "Freund wurde gelöscht";
                document.body.appendChild(paragraph);
            });
        }
        setTimeout(() => {
            window.location.reload();
        }, 2000);
        setLoadFriends();
    }


    // ausgeben
    return (
        <div className='finden'>
            <h3>Meine Freunde</h3>
            <hr />
            <ul>
                {loadFriend}
            </ul>
        </div>
    )
}

