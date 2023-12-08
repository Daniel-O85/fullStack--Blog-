// Paket
const express = require("express");
const server = express();

const cors = require("cors");
server.use(cors());

const sqlite3 = require("sqlite3");



// Port
const PortNummer = 3344;

// Datenbank Verbindung
let db = new sqlite3.Database("./datenBestand.db", (fehler) => {
    if (fehler) console.log(fehler.message);
    else
        console.log("Verbindung zur Datenbank erfolgreich aufgebaut");
})

// Routen

// /login...
server.get("/login/:name/:pass", (request, respond) => {
    db.all(`SELECT * FROM Benutzerkonto WHERE Benutzer = '${request.params.name}' AND Kennwort = '${request.params.pass}'`,
        (fehler, zeile) => {
            let a = zeile.length > 0 ? zeile[0].KontoNr : 0;
            respond.send(a.toString());
        });
});

// /registrieren...
server.get("/registrieren/:objekt", (request, respond) => {
    const o = JSON.parse(request.params.objekt);
    if (o !== 0)
        db.run(
            `INSERT INTO Benutzerkonto
        (Benutzer, Kennwort, Vorname, Nachname)
        VALUES
        ('${o.Benutzer}',
        '${o.Kennwort}',
        '${o.Vorname}',
        '${o.Nachname}')`,
            (fehler) => console.error(fehler)
        );
    respond.send("ok");
})

// /datenLesen...
server.get("/datenLesen/:objekt", (request, respond) => {
    const kontoNr = request.params.objekt;

    // Führe eine Datenbankabfrage durch, um die Benutzerdaten basierend auf der KontoNr abzurufen.
    db.get(`SELECT * FROM Benutzerkonto WHERE KontoNr = ?`, [kontoNr], (fehler, zeile) => {
        if (fehler) {
            console.error(fehler);
            respond.status(500).json({ error: "Interner Serverfehler" });
        } else if (zeile) {
            // Sende die gefundenen Benutzerdaten als JSON an das Frontend.
            respond.json(zeile);
        } else {
            // Benutzer mit der angegebenen KontoNr wurde nicht gefunden.
            respond.status(404).json({ error: "Benutzer nicht gefunden" });
        }
    });
});

//datenSchreiben...
server.get("/datenSchreiben/:objekt", (request, respond) => {
    const o = JSON.parse(request.params.objekt);
    if (o !== 0) {
        db.run(
            `UPDATE Benutzerkonto 
            SET Benutzer = '${o.Benutzer}',
                Kennwort = '${o.Kennwort}',
                Vorname = '${o.Vorname}',
                Nachname = '${o.Nachname}',
                Telefon = '${o.Telefon}',
                EMail = '${o.EMail}',
                Adresse = '${o.Adresse}',
                PLZ = '${o.PLZ}',
                Ort = '${o.Ort}'
            WHERE KontoNr = '${o.KontoNr}'`,
            (fehler) => {
                if (fehler) {
                    console.error(fehler);
                }
            }
        );
    }
    respond.send("ok");
});

// /blog/abrufen...
server.get("/blog/abrufen/:konto", (request, respond) => {
    const kontoNr = request.params.konto;

    db.all(
        `SELECT id, Titel, Text FROM BlogDaten WHERE KontoNr = '${kontoNr}'`,
        (fehler, zeilen) => {
            if (fehler) {
                console.error(fehler);
            } else {
                const blogEinträge = zeilen.map(zeile => ({
                    id: zeile.id,
                    Titel: zeile.Titel,
                    Text: zeile.Text
                }));
                respond.json(blogEinträge);
            }
        }
    );
});

// /blog/lastThree...
server.get("/blog/lastthree/:konto", (request, respond) => {
    const kontoNr = request.params.konto;
    db.all(
        `SELECT * FROM BlogDaten WHERE KontoNr = '${kontoNr}' ORDER BY id DESC LIMIT 3`,
        (fehler, zeilen) => {
            if (fehler) {
                console.error(fehler);
                respond.status(500).json({ error: "Interner Serverfehler" });
            } else {
                respond.send(JSON.stringify(zeilen));
            }
        }
    );
});

// /blog/erstellen...
server.get("/blog/erstellen/:konto/:titel/:text", (request, respond) => {
    db.run(
        `INSERT INTO BlogDaten (KontoNr, Titel, Text)
        VALUES
        ('${request.params.konto}',
        '${request.params.titel}',
        '${request.params.text}')
        `,
        (fehler) => console.error(fehler)
    );
    respond.send("ok");
})
// /blog/edit...
server.get("/blog/edit/:dnr/:titel/:text", (request, respond) => {
    db.run(`UPDATE BlogDaten SET 
    Titel = '${request.params.titel}',
    Text = '${request.params.text}' 
    WHERE id = '${request.params.dnr}'`,
        (fehler) => console.error(fehler));
    respond.send("ok");
});

// /blog/entf...
server.get("/blog/entf/:dnr", (request, respond) => {
    db.run(
        `DELETE FROM BlogDaten WHERE id = '${request.params.dnr}'`,
        (fehler) => console.error(fehler)
    );
    respond.send(alert("Blogeintrag erfolgreich gelöscht"));
});

// /freunde/finden...
server.get("/freunde/finden/:konto/:begriff", (request, respond) => {
    let b = request.params.begriff;
    let k = request.params.konto;
    db.all(
        `SELECT * FROM Benutzerkonto WHERE (
        Vorname LIKE '%${b}' OR Vorname LIKE '%${b}%' OR Vorname LIKE '${b}%' OR 
        Nachname LIKE '%${b}' OR Nachname LIKE '%${b}%' OR Nachname LIKE '${b}%' OR
        Benutzer LIKE '%${b}' OR Benutzer LIKE '%${b}%' OR Benutzer LIKE '${b}%') AND KontoNr <> '${k}' `,
        (fehler, zeilen) => {
            console.log(zeilen)
            respond.send(zeilen);
        }
    );
})

// /freundschaft...
server.get("/freundschaft/:k1/:k2", (request, respond) => {
    db.run(
        `INSERT INTO Freunde (KontoNr, FreundKontoNr)
        VALUES
        ('${request.params.k1}',
        '${request.params.k2}')`,
        (fehler) => {
            if (!fehler) {
                respond.send("ok");
            } else {
                respond.status(500).send("Fehler beim Akzeptieren der Freundesanfrage");
            }
        }
    );
});

// /freund/entf...
server.get("/freund/entf/:k1/:k2", (request, respond) => {
    db.run(
        `DELETE FROM Freunde WHERE KontoNr = '${request.params.k1}' AND FreundKontoNr = '${request.params.k2}'`,
        (fehler) => {
            if (!fehler) {
                respond.send("ok");
            } else {
                respond.status(500).send("Fehler beim Entfernen des Freundes");
            }
        }
    );
});

// /freunde/auflisten...
server.get("/freunde/auflisten/:konto", (request, respond) => {
    db.all(
        `SELECT * FROM Freunde WHERE KontoNr = '${request.params.konto}'`,
        (fehler, zeilen) => {
            console.log(zeilen);
            respond.send(JSON.stringify(zeilen));
        }
    );
})

// /freundinfo...
server.get("/freundinfo/:konto", (request, respond) => {
    db.all(
        `SELECT * FROM BenutzerKonto WHERE KontoNr = '${request.params.konto}'`,
        (fehler, zeilen) => {
            if (typeof zeilen === "object") {
                const meineDaten = {
                    Vorname: zeilen[0].Vorname,
                    Nachname: zeilen[0].Nachname,
                    Benutzer: zeilen[0].Benutzer,
                    EMail: zeilen[0].EMail
                };
                console.log(meineDaten);
                respond.send(JSON.stringify(meineDaten));
            } else respond.send("{}");
        }
    );
})

// Ausgabe
const newServer = server.listen(
    PortNummer,
    () => {
        console.log(`Server horcht nach http://localhost:${PortNummer}/`);
    }
);