// server/server.js
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// API: Get all guests
app.get('/api/guests', (req, res) => {
    db.all('SELECT * FROM guests', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: Get single guest
app.get('/api/guests/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM guests WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Guest not found' });
        res.json(row);
    });
});

// API: Add a guest
app.post('/api/guests', (req, res) => {
    const { name, email, rsvp, attending, meal, spanish, group } = req.body;
    const sql = `INSERT INTO guests (name, email, rsvp, attending, meal, spanish, [group])
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [name, email, rsvp, attending, meal, spanish, group];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

// API: Update guest (full update)
app.put('/api/guests/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, rsvp, attending, meal, spanish, group } = req.body;
    const sql = `UPDATE guests SET name = ?, email = ?, rsvp = ?, attending = ?,
                 meal = ?, spanish = ?, [group] = ? WHERE id = ?`;
    const params = [name, email, rsvp, attending, meal, spanish, group, id];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Guest not found' });
        res.json({ message: 'Guest updated successfully' });
    });
});

// API: Partial update guest
app.patch('/api/guests/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic SQL based on provided fields
    const fields = Object.keys(updates);
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

    const setClause = fields.map(field => `[${field}] = ?`).join(', ');
    const sql = `UPDATE guests SET ${setClause} WHERE id = ?`;
    const params = [...fields.map(field => updates[field]), id];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Guest not found' });
        res.json({ message: 'Guest updated successfully' });
    });
});

// API: Delete guest
app.delete('/api/guests/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM guests WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Guest not found' });
        res.json({ message: 'Guest deleted successfully' });
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));