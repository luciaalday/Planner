// server/database.js

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./app.db', (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    }
    else {
        console.log('Connected to SQLite Database');
        try {
            db.run(`CREATE TABLE IF NOT EXISTS guests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstname TEXT,
                lastname TEXT,
                email TEXT,
                address TEXT,
                rsvp DATE,
                attending BOOLEAN,
                meal INT,
                [group] TEXT,
                plus_one BOOLEAN,
                note TEXT
            )`);
            console.log("Tables guests established");
        } catch (err) {
            console.error("Error:", error.message);
        }
    }
});

module.exports = db;