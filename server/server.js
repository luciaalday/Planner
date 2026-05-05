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

// API: Add a guest
app.post('/api/guests', (req, res) => {
    const { name, email } = req.body;
    db.run('INSERT INTO guests (name, email) VALUES (?, ?)', [name, email], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));