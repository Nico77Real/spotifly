const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, (req, res) => {
  db.all(
    'SELECT * FROM playlists WHERE user_id = ? ORDER BY created_at DESC',
    [req.userId],
    (err, playlists) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(playlists);
    }
  );
});

router.get('/:id', authMiddleware, (req, res) => {
  db.get('SELECT * FROM playlists WHERE id = ?', [req.params.id], (err, playlist) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    db.all(
      `SELECT t.* FROM tracks t
       INNER JOIN playlist_tracks pt ON t.id = pt.track_id
       WHERE pt.playlist_id = ?
       ORDER BY pt.position ASC`,
      [req.params.id],
      (err, tracks) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.json({ ...playlist, tracks });
      }
    );
  });
});

router.post('/', authMiddleware, (req, res) => {
  const { name, description, cover_url } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  db.run(
    'INSERT INTO playlists (name, description, cover_url, user_id) VALUES (?, ?, ?, ?)',
    [name, description, cover_url, req.userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({
        id: this.lastID,
        name,
        description,
        cover_url,
        user_id: req.userId
      });
    }
  );
});

router.put('/:id', authMiddleware, (req, res) => {
  const { name, description, cover_url } = req.body;

  db.run(
    'UPDATE playlists SET name = ?, description = ?, cover_url = ? WHERE id = ? AND user_id = ?',
    [name, description, cover_url, req.params.id, req.userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Playlist not found or unauthorized' });
      }
      res.json({ message: 'Playlist updated successfully' });
    }
  );
});

router.delete('/:id', authMiddleware, (req, res) => {
  db.run(
    'DELETE FROM playlists WHERE id = ? AND user_id = ?',
    [req.params.id, req.userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Playlist not found or unauthorized' });
      }
      res.json({ message: 'Playlist deleted successfully' });
    }
  );
});

router.post('/:id/tracks', authMiddleware, (req, res) => {
  const { track_id } = req.body;

  db.get('SELECT MAX(position) as max_pos FROM playlist_tracks WHERE playlist_id = ?', [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const position = (row.max_pos || 0) + 1;

    db.run(
      'INSERT INTO playlist_tracks (playlist_id, track_id, position) VALUES (?, ?, ?)',
      [req.params.id, track_id, position],
      function (err) {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Track added to playlist' });
      }
    );
  });
});

router.delete('/:id/tracks/:trackId', authMiddleware, (req, res) => {
  db.run(
    'DELETE FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?',
    [req.params.id, req.params.trackId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Track removed from playlist' });
    }
  );
});

module.exports = router;
