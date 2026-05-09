import express from 'express';
import cors from 'cors';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Turso client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize database schema on first run
const initializeDatabase = async () => {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS guests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL,
        email TEXT,
        address TEXT,
        rsvp DATE,
        attending BOOLEAN,
        meal INTEGER,
        [group] TEXT,
        plus_one BOOLEAN,
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database schema initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err.message);
  }
};

// GET /api/guests - Get all guests
app.get('/api/guests', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM guests ORDER BY created_at DESC');
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/guests/:id - Get single guest
app.get('/api/guests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.execute('SELECT * FROM guests WHERE id = ?', [parseInt(id)]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/guests - Add a guest
app.post('/api/guests', async (req, res) => {
  try {
    const { firstname, lastname, email, address, rsvp, attending, meal, group, plus_one, note } = req.body;

    const result = await client.execute(
      `INSERT INTO guests (firstname, lastname, email, address, rsvp, attending, meal, [group], plus_one, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstname, lastname, email || null, address || null, rsvp || null, attending || false, meal || null, group || null, plus_one || false, note || null]
    );
    return res.status(201).json({ id: result.lastInsertRowid });
  } catch (err) {
    console.error('API error:', err);
    return res.status(400).json({ error: 'Failed to create guest', details: err.message });
  }
});

// PUT /api/guests/:id - Update guest
app.put('/api/guests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, address, rsvp, attending, meal, group, plus_one, note } = req.body;

    const result = await client.execute(
      `UPDATE guests SET firstname = ?, lastname = ?, email = ?, address = ?, rsvp = ?, attending = ?,
       meal = ?, [group] = ?, plus_one = ?, note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [firstname, lastname, email || null, address || null, rsvp || null, attending || false, meal || null, group || null, plus_one || false, note || null, parseInt(id)]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    return res.status(200).json({ message: 'Guest updated successfully' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(400).json({ error: 'Failed to update guest', details: err.message });
  }
});

// PATCH /api/guests/:id - Partial update guest
app.patch('/api/guests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const fields = Object.keys(updates);

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const setClause = fields.map(field => `[${field}] = ?`).join(', ');
    const sql = `UPDATE guests SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const params = [...fields.map(field => updates[field]), parseInt(id)];

    const result = await client.execute(sql, params);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    return res.status(200).json({ message: 'Guest updated successfully' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(400).json({ error: 'Failed to update guest', details: err.message });
  }
});

// DELETE /api/guests/:id - Delete guest
app.delete('/api/guests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await client.execute('DELETE FROM guests WHERE id = ?', [parseInt(id)]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    return res.status(200).json({ message: 'Guest deleted successfully' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(400).json({ error: 'Failed to delete guest', details: err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
});
