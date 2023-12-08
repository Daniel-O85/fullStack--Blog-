import React, { useState, useEffect } from 'react';
import "./Blog.css";

export default function Blog() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [acountNr, acountNrUpdate] = useState(undefined);
    const [newTitle, newTitlePost] = useState("");
    const [newText, newTextPost] = useState("");
    const input = document.getElementById("blog-title");
    const textA = document.getElementById("blog-text");

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
        // Anfrage an den Server schicken
        window.fetch(u)
            // Antwort erhalten und als Text weiterreichen
            .then(rohdaten => rohdaten.text())
            // Die weitergereichte Information an die Callback-Funktion übergeben
            .then(daten => cb(daten))
            // Falls ein Fehler aufteten sollte, diese auf der Konsole ausgegeben
            .catch((fehler) => console.error(fehler));
    }

    // anzeigen
    function updateBlogContent() {
        let Konto;
        // *** //
        if (acountNr == undefined) {
            let KN = localStorage.getItem("kontoNr");
            Konto = KN;
            acountNrUpdate(KN);
        } else Konto = acountNr;
        // *** //
        readJSONFromServer(
            "http://localhost:3344/blog/abrufen/" + Konto,
            (respond) => {
                const daten = [];
                // *** //
                respond.forEach(
                    (row) => {
                        daten.push(
                            <>
                                <h3>{row.Titel}</h3>
                                <p>{row.Text}</p>
                                <button onClick={() => { bearbeiten(row.id) }}>Bearbeiten</button>
                                <button onClick={() => { entfernen(row.id) }}>Entfernen</button>
                                <hr />
                            </>
                        );
                    }
                );
                // *** //
                setBlogPosts(daten);
            }
        );
    }

    // bearbeiten
    function updateBlogContent() {
        let Konto;
        // *** //
        if (acountNr === undefined) {
            let KN = localStorage.getItem("kontoNr");
            Konto = KN;
            acountNrUpdate(KN);
        } else Konto = acountNr;
        // *** //
        readJSONFromServer(
            "http://localhost:3344/blog/abrufen/" + Konto,
            (respond) => {
                const daten = [];
                // *** //
                respond.forEach(
                    (row) => {
                        daten.push(
                            <div>
                                <div class="anzeigen" id={`eins-${row.id}`}>
                                    <h3>{row.Titel}</h3>
                                    <p>{row.Text}</p>
                                    <button className='btn-edit' onClick={() => { bearbeiten(row.id) }}>Bearbeiten</button>
                                    <button className='btn-delete' onClick={() => { entfernen(row.id) }}>Entfernen</button>
                                </div>
                                <div class="verstecken edit" id={`zwei-${row.id}`}>
                                    <div className='edit-box'>
                                        <input className='newTitle' type='text' defaultValue={row.Titel} />
                                        <textarea className='newText'>{row.Text}</textarea>
                                    </div>
                                    <button className='btn-save' onClick={() => { speichern(row.id) }}>Speichern</button>
                                    <button className='btn-cancel' onClick={() => { abbrechen(row.id) }}>Abbrechen</button>
                                </div>
                                <hr />
                            </div>
                        );
                    }
                );
                // *** //
                setBlogPosts(daten);
            }
        );
    }

    // bearbeiten
    // Funktion zum Zurücksetzen der Klassen
    function bearbeiten(blogId) {
        const standard = document.getElementById(`eins-${blogId}`);
        const edit = document.getElementById(`zwei-${blogId}`);
        if (standard) {
            standard.classList.remove("anzeigen");
            standard.classList.add("verstecken");
        }
        if (edit) {
            edit.classList.remove("verstecken");
            edit.classList.add("anzeigen");
        }
    }

    // Funktion für "Speichern"
    function speichern(blogId) {
        const standard = document.getElementById(`eins-${blogId}`);
        const edit = document.getElementById(`zwei-${blogId}`);

        // sicherstellen, dass die Elemente vorhanden sind
        if (standard && edit) {

            standard.classList.remove("verstecken");
            standard.classList.add("anzeigen");
            edit.classList.remove("anzeigen");
            edit.classList.add("verstecken");

            //  neue Werte aus den Input-Feldern lesen
            const newTitleInput = edit.querySelector('.newTitle');
            const newTextInput = edit.querySelector('.newText');
            const newTitle = newTitleInput.value;
            const newText = newTextInput.value;
            // alert(titleFieldEdit + "\n\n" + textFieldEdit);
            // Hier  Sie die Anfrage an den Server senden, um die Änderungen in die Datenbank zu speichern
            readTEXTFromServer(`http://localhost:3344/blog/edit/${blogId}/${newTitle}/${newText}`, (response) => {
                const paragraph = document.createElement("p");
                paragraph.classList.add("update-blog");
                paragraph.textContent = "Blogeintrag wurde geändert";
                document.body.appendChild(paragraph);

                setTimeout(() => {
                    window.location.reload();
                }, 800);
            });

        }
    }


    // Funktion für "Abbrechen"
    function abbrechen(blogId) {
        const standard = document.getElementById(`eins-${blogId}`);
        const edit = document.getElementById(`zwei-${blogId}`);
        if (standard) {
            standard.classList.remove("verstecken");
            standard.classList.add("anzeigen");
        }
        if (edit) {
            edit.classList.remove("anzeigen");
            edit.classList.add("verstecken");
        }
    }

    // löschen
    function entfernen(blogId) {
        readTEXTFromServer(`http://localhost:3344/blog/entf/${blogId}`,
            (e) => {
                // Wenn die Anfrage erfolgreich war, zeige den Text im Paragraph an
                const paragraph = document.createElement("p");
                paragraph.classList.add("delete-blog");
                paragraph.textContent = "Blogeintrag wurde gelöscht";
                document.body.appendChild(paragraph);
            });
        //
        setTimeout(() => {
            window.location.reload();
        }, 2000);
        updateBlogContent();
    }

    // erstellen
    function erstellen() {
        if (newTitle == "") {
            alert("Bitte Titel eingeben");
        } else if (newText == "") {
            alert("Bitte Text eingeben");
        } else {
            // Hier senden wir die Anfrage an den Server, um einen neuen Blogeintrag zu erstellen
            readTEXTFromServer(`http://localhost:3344/blog/erstellen/${acountNr}/${newTitle}/${newText}`,
                (e) => {
                    updateBlogContent();
                    newTitlePost("");
                    newTextPost("");
                    input.value = "";
                    textA.value = "";
                }
            );
        }

    };

    useEffect(
        () => {
            updateBlogContent();
        },
        []
    );

    // ausgeben
    return (
        <>
            <div id='box' className='blog'>
                {blogPosts}
                <h3>Neuer Blogeintrag</h3>
                <input id='blog-title' type='text' placeholder='Titel...' onKeyUp={(e) => newTitlePost(e.target.value)} />
                <br />
                <textarea id='blog-text' placeholder='Text...' onKeyUp={(e) => newTextPost(e.target.value)}></textarea>
                <br />
                <button onClick={() => erstellen()}>Erstellen</button>
            </div>
            <div id='edit'></div>
        </>

    );

}
