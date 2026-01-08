import { useEffect, useRef, useState } from 'react'
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRandom, FaRedo, FaVolumeUp, FaHeart, FaRegHeart } from 'react-icons/fa'
import { usePlayerStore } from '../store/playerStore'
import { getTrackUrl, getCoverUrl, tracks as tracksApi } from '../utils/api'
import styles from './Player.module.css'

export default function Player() {
  const audioRef = useRef(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favorites, setFavorites] = useState([])
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    repeat,
    shuffle,
    setAudio,
    togglePlay,
    setVolume,
    setCurrentTime,
    setDuration,
    seekTo,
    nextTrack,
    previousTrack,
    toggleRepeat,
    toggleShuffle,
  } = usePlayerStore()

  useEffect(() => {
    if (audioRef.current) {
      setAudio(audioRef.current)
      audioRef.current.volume = volume
    }
    loadFavorites()
  }, [])

  useEffect(() => {
    if (currentTrack) {
      checkIfFavorite()
    }
  }, [currentTrack])

  const loadFavorites = async () => {
    try {
      const response = await tracksApi.getFavorites()
      setFavorites(response.data.map(t => t.id))
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  const checkIfFavorite = () => {
    setIsFavorite(favorites.includes(currentTrack?.id))
  }

  const toggleFavorite = async () => {
    if (!currentTrack) return
    
    try {
      if (isFavorite) {
        await tracksApi.removeFavorite(currentTrack.id)
        setFavorites(favorites.filter(id => id !== currentTrack.id))
        setIsFavorite(false)
      } else {
        await tracksApi.addFavorite(currentTrack.id)
        setFavorites([...favorites, currentTrack.id])
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const trackUrl = getTrackUrl(currentTrack)
      if (trackUrl) {
        audioRef.current.src = trackUrl
        audioRef.current.load()
        if (isPlaying) {
          audioRef.current.play().catch(err => {
            console.error('Error playing audio:', err)
          })
        }
      }
    }
  }, [currentTrack])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    checkIfFavorite()
  }, [favorites])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleEnded = () => {
    if (repeat === 'one') {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    } else {
      nextTrack()
    }
  }

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!currentTrack) {
    return null
  }

  return (
    <div className={styles.player}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className={styles.trackInfo}>
        <img 
          src={getCoverUrl(currentTrack)} 
          alt={currentTrack.title}
          className={styles.cover}
        />
        <div className={styles.details}>
          <div className={styles.title}>{currentTrack.title}</div>
          <div className={styles.artist}>{currentTrack.artist}</div>
        </div>
        <button className={styles.likeBtn} onClick={toggleFavorite}>
          {isFavorite ? <FaHeart style={{ color: '#1db954' }} /> : <FaRegHeart />}
        </button>
      </div>

      <div className={styles.controls}>
        <div className={styles.buttons}>
          <button 
            onClick={toggleShuffle}
            className={shuffle ? styles.active : ''}
          >
            <FaRandom />
          </button>
          <button onClick={previousTrack}>
            <FaStepBackward />
          </button>
          <button onClick={togglePlay} className={styles.playBtn}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={nextTrack}>
            <FaStepForward />
          </button>
          <button 
            onClick={toggleRepeat}
            className={repeat !== 'off' ? styles.active : ''}
          >
            <FaRedo />
            {repeat === 'one' && <span className={styles.repeatOne}>1</span>}
          </button>
        </div>

        <div className={styles.progress}>
          <span className={styles.time}>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => seekTo(Number(e.target.value))}
            className={styles.progressBar}
          />
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>

      <div className={styles.volume}>
        <FaVolumeUp />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className={styles.volumeBar}
        />
      </div>
    </div>
  )
}
