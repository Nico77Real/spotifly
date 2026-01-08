const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

router.get('/me', authMiddleware, (req, res) => {
  db.get('SELECT id, username, email, avatar, created_at FROM users WHERE id = ?', [req.userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
});

router.put('/me', authMiddleware, (req, res) => {
  const { username, avatar } = req.body;

  db.run(
    'UPDATE users SET username = ?, avatar = ? WHERE id = ?',
    [username, avatar, req.userId],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Username already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Profile updated successfully' });
    }
  );
});

module.exports = router;
