const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.get('/', authMiddleware, (req, res) => {
  db.all('SELECT * FROM tracks ORDER BY created_at DESC', [], (err, tracks) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tracks);
  });
});

router.get('/:id', authMiddleware, (req, res) => {
  db.get('SELECT * FROM tracks WHERE id = ?', [req.params.id], (err, track) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json(track);
  });
});

router.post('/upload', authMiddleware, upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), (req, res) => {
  const { title, artist, album, duration } = req.body;
  
  if (!title || !artist) {
    return res.status(400).json({ error: 'Title and artist are required' });
  }

  const audioFile = req.files['audio'] ? req.files['audio'][0].filename : null;
  const coverFile = req.files['cover'] ? req.files['cover'][0].filename : null;

  db.run(
    'INSERT INTO tracks (title, artist, album, duration, file_path, cover_url, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, artist, album, duration, audioFile, coverFile, req.userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({
        id: this.lastID,
        title,
        artist,
        album,
        duration,
        file_path: audioFile,
        cover_url: coverFile
      });
    }
  );
});

router.post('/url', authMiddleware, (req, res) => {
  const { title, artist, album, duration, url, cover_url } = req.body;

  db.run(
    'INSERT INTO tracks (title, artist, album, duration, source, file_path, cover_url, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [title, artist, album, duration, 'url', url, cover_url, req.userId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({
        id: this.lastID,
        title,
        artist,
        album,
        duration,
        source: 'url',
        file_path: url,
        cover_url
      });
    }
  );
});

router.delete('/:id', authMiddleware, (req, res) => {
  db.get('SELECT * FROM tracks WHERE id = ?', [req.params.id], (err, track) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    if (track.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    db.run('DELETE FROM tracks WHERE id = ?', [req.params.id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (track.file_path) {
        const filePath = path.join(uploadsDir, track.file_path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      if (track.cover_url && !track.cover_url.startsWith('http')) {
        const coverPath = path.join(uploadsDir, track.cover_url);
        if (fs.existsSync(coverPath)) {
          fs.unlinkSync(coverPath);
        }
      }

      res.json({ message: 'Track deleted successfully' });
    });
  });
});

router.get('/favorites/list', authMiddleware, (req, res) => {
  const query = `
    SELECT t.* FROM tracks t
    INNER JOIN favorites f ON t.id = f.track_id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `;

  db.all(query, [req.userId], (err, tracks) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tracks);
  });
});

router.post('/:id/favorite', authMiddleware, (req, res) => {
  db.run(
    'INSERT OR IGNORE INTO favorites (user_id, track_id) VALUES (?, ?)',
    [req.userId, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Track added to favorites' });
    }
  );
});

router.delete('/:id/favorite', authMiddleware, (req, res) => {
  db.run(
    'DELETE FROM favorites WHERE user_id = ? AND track_id = ?',
    [req.userId, req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Track removed from favorites' });
    }
  );
});

module.exports = router;
