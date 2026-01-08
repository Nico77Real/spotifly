const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const play = require('play-dl');

router.get('/stream/:videoId', authMiddleware, async (req, res) => {
  const { videoId } = req.params;

  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const info = await play.video_info(url);
    const audioFormat = info.video_details.music ? info.video_details.music[0] : null;
    
    if (audioFormat && audioFormat.url) {
      res.json({ url: audioFormat.url });
    } else {
      res.status(404).json({ error: 'No audio format found' });
    }
  } catch (error) {
    console.error('YouTube streaming error:', error);
    res.status(500).json({ error: 'Error getting YouTube stream' });
  }
});

router.get('/proxy/:videoId', async (req, res) => {
  const { videoId } = req.params;

  try {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const stream = await play.stream(url, {
      quality: 2
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Length', stream.contentLength || 0);
    
    stream.stream.on('error', (error) => {
      console.error('YouTube stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error streaming YouTube audio' });
      }
    });

    stream.stream.pipe(res);
  } catch (error) {
    console.error('YouTube proxy error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Error proxying YouTube stream' });
    }
  }
});

module.exports = router;
