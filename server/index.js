const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3001;

const authRoutes = require('./routes/auth');
const trackRoutes = require('./routes/tracks');
const playlistRoutes = require('./routes/playlists');
const userRoutes = require('./routes/users');
const searchRoutes = require('./routes/search');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);

app.listen(PORT, () => {
  console.log(`🎵 Spotifly server running on port ${PORT}`);
});
