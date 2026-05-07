// api/guests.js
import sqlite3 from 'sqlite3';

const sqlite = sqlite3.verbose();

// Use in-memory database for Vercel (no persistent storage across requests)
// For production, consider using a cloud database
let db = null;

const getDB = () => {
    if (!db) {
        db = new sqlite3.Database(':memory:', (err) => {
            if (err) {
                console.error("Error opening database:", err.message);
            } else {
                console.log('Connected to in-memory SQLite Database');
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
            }
        });
    }
    return db;
};

const promisifyDB = (db, method) => {
    return (query, params) => {
        return new Promise((resolve, reject) => {
            db[method](query, params, function(err) {
                if (err) reject(err);
                else resolve(this);
            });
        });
    };
};

const promisifyDBAll = (db) => {
    return (query, params) => {
        return new Promise((resolve, reject) => {
            db.all(query, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    };
};

const promisifyDBGet = (db) => {
    return (query, params) => {
        return new Promise((resolve, reject) => {
            db.get(query, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    };
};

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const database = getDB();
        const dbAll = promisifyDBAll(database);
        const dbGet = promisifyDBGet(database);
        const dbRun = promisifyDB(database, 'run');

        // Extract ID from URL path: /api/guests/123 or query: /api/guests?id=123
        let id = req.query.id;
        if (!id && req.url.includes('/guests/')) {
            const match = req.url.match(/\/guests\/(\d+)/);
            if (match) id = match[1];
        }

        // GET /api/guests - Get all guests
        if (req.method === 'GET' && !id) {
            const rows = await dbAll('SELECT * FROM guests', []);
            return res.status(200).json(rows);
        }

        // GET /api/guests/X - Get single guest
        if (req.method === 'GET' && id) {
            const row = await dbGet('SELECT * FROM guests WHERE id = ?', [id]);
            if (!row) return res.status(404).json({ error: 'Guest not found' });
            return res.status(200).json(row);
        }

        // POST /api/guests - Add a guest
        if (req.method === 'POST') {
            const { firstname, lastname, email, address, rsvp, attending, meal, group, plus_one, note } = req.body;
            const sql = `INSERT INTO guests (firstname, lastname, email, address, rsvp, attending, meal, [group], plus_one, note)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const params = [firstname, lastname, email, address, rsvp, attending, meal, group, plus_one, note];
            
            const result = await dbRun(sql, params);
            return res.status(201).json({ id: result.lastID });
        }

        // PUT /api/guests/X - Update guest
        if (req.method === 'PUT' && id) {
            const { firstname, lastname, email, address, rsvp, attending, meal, group, plus_one, note } = req.body;
            const sql = `UPDATE guests SET firstname = ?, lastname = ?, email = ?, address = ?, rsvp = ?, attending = ?,
                         meal = ?, [group] = ?, plus_one = ?, note = ? WHERE id = ?`;
            const params = [firstname, lastname, email, address, rsvp, attending, meal, group, plus_one, note, id];

            const result = await dbRun(sql, params);
            if (result.changes === 0) return res.status(404).json({ error: 'Guest not found' });
            return res.status(200).json({ message: 'Guest updated successfully' });
        }

        // PATCH /api/guests/X - Partial update guest
        if (req.method === 'PATCH' && id) {
            const updates = req.body;
            const fields = Object.keys(updates);
            if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

            const setClause = fields.map(field => `[${field}] = ?`).join(', ');
            const sql = `UPDATE guests SET ${setClause} WHERE id = ?`;
            const params = [...fields.map(field => updates[field]), id];

            const result = await dbRun(sql, params);
            if (result.changes === 0) return res.status(404).json({ error: 'Guest not found' });
            return res.status(200).json({ message: 'Guest updated successfully' });
        }

        // DELETE /api/guests/X - Delete guest
        if (req.method === 'DELETE' && id) {
            const sql = 'DELETE FROM guests WHERE id = ?';
            const result = await dbRun(sql, [id]);
            if (result.changes === 0) return res.status(404).json({ error: 'Guest not found' });
            return res.status(200).json({ message: 'Guest deleted successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('API error:', err);
        return res.status(500).json({ error: err.message });
    }
}
