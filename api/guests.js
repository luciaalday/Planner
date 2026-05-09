// api/guests.js
import { createClient } from '@libsql/client';

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
  } catch (err) {
    console.error('Database initialization error:', err.message);
  }
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
    // Initialize database on first request
    await initializeDatabase();

    // Extract ID from URL path: /api/guests/123 or query: /api/guests?id=123
    let id = req.query.id;
    if (!id && req.url.includes('/guests/')) {
      const match = req.url.match(/\/guests\/(\d+)/);
      if (match) id = match[1];
    }

    // GET /api/guests - Get all guests
    if (req.method === 'GET' && !id) {
      const result = await client.execute('SELECT * FROM guests ORDER BY created_at DESC');
      return res.status(200).json(result.rows);
    }

    // GET /api/guests/:id - Get single guest
    if (req.method === 'GET' && id) {
      const result = await client.execute('SELECT * FROM guests WHERE id = ?', [parseInt(id)]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Guest not found' });
      }
      return res.status(200).json(result.rows[0]);
    }

    // POST /api/guests - Add a guest
    if (req.method === 'POST') {
      const { firstname, lastname, email, address, rsvp, attending, meal, group, plus_one, note } = req.body;
      
      try {
        const result = await client.execute(
          `INSERT INTO guests (firstname, lastname, email, address, rsvp, attending, meal, [group], plus_one, note)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [firstname, lastname, email || null, address || null, rsvp || null, attending || false, meal || null, group || null, plus_one || false, note || null]
        );
        return res.status(201).json({ id: result.lastInsertRowid });
      } catch (err) {
        return res.status(400).json({ error: 'Failed to create guest', details: err.message });
      }
    }

    // PUT /api/guests/:id - Update guest
    if (req.method === 'PUT' && id) {
      const { firstname, lastname, email, address, rsvp, attending, meal, group, plus_one, note } = req.body;
      
      try {
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
        return res.status(400).json({ error: 'Failed to update guest', details: err.message });
      }
    }

    // PATCH /api/guests/:id - Partial update guest
    if (req.method === 'PATCH' && id) {
      const updates = req.body;
      const fields = Object.keys(updates);
      
      if (fields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }

      try {
        // Build dynamic SQL for partial update
        const setClause = fields.map(field => `[${field}] = ?`).join(', ');
        const sql = `UPDATE guests SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        const params = [...fields.map(field => updates[field]), parseInt(id)];

        const result = await client.execute(sql, params);
        
        if (result.changes === 0) {
          return res.status(404).json({ error: 'Guest not found' });
        }
        return res.status(200).json({ message: 'Guest updated successfully' });
      } catch (err) {
        return res.status(400).json({ error: 'Failed to update guest', details: err.message });
      }
    }

    // DELETE /api/guests/:id - Delete guest
    if (req.method === 'DELETE' && id) {
      try {
        const result = await client.execute('DELETE FROM guests WHERE id = ?', [parseInt(id)]);
        
        if (result.changes === 0) {
          return res.status(404).json({ error: 'Guest not found' });
        }
        return res.status(200).json({ message: 'Guest deleted successfully' });
      } catch (err) {
        return res.status(400).json({ error: 'Failed to delete guest', details: err.message });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: err.message });
  }
}
