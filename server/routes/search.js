const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const searchTerm = `%${q}%`;

  db.all(
    `SELECT * FROM tracks 
     WHERE title LIKE ? OR artist LIKE ? OR album LIKE ?
     ORDER BY created_at DESC LIMIT 50`,
    [searchTerm, searchTerm, searchTerm],
    (err, tracks) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ tracks });
    }
  );
});

module.exports = router;
