import { useState, useEffect } from 'react'
import { FaPlay, FaHeart, FaRegHeart, FaPlus, FaTrash } from 'react-icons/fa'
import { usePlayerStore } from '../store/playerStore'
import { getCoverUrl, tracks as tracksApi } from '../utils/api'
import AddToPlaylistModal from './AddToPlaylistModal'
import styles from './TrackRow.module.css'

export default function TrackRow({ 
  track, 
  index, 
  queue = [], 
  onDelete, 
  showDelete = false,
  showAddToPlaylist = false
}) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const { playTrack } = usePlayerStore()

  useEffect(() => {
    checkIfFavorite()
  }, [track])

  const checkIfFavorite = async () => {
    try {
      const response = await tracksApi.getFavorites()
      const favoriteIds = response.data.map(t => t.id)
      setIsFavorite(favoriteIds.includes(track.id))
    } catch (error) {
      console.error('Error checking favorite:', error)
    }
  }

  const toggleFavorite = async (e) => {
    e.stopPropagation()
    setLoading(true)
    
    try {
      if (isFavorite) {
        await tracksApi.removeFavorite(track.id)
        setIsFavorite(false)
      } else {
        await tracksApi.addFavorite(track.id)
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = () => {
    playTrack(track, queue.length > 0 ? queue : [track])
  }

  const handleDelete = (e) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(track.id)
    }
  }

  const handleAddToPlaylist = (e) => {
    e.stopPropagation()
    setShowModal(true)
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      {showModal && (
        <AddToPlaylistModal
          trackId={track.id}
          onClose={() => setShowModal(false)}
        />
      )}
      <div className={styles.trackRow} onClick={handlePlay} style={{ '--index': index }}>
      <div className={styles.trackNumber}>{index + 1}</div>
      <img src={getCoverUrl(track)} alt={track.title} className={styles.trackCover} />
      <div className={styles.trackInfo}>
        <div className={styles.trackTitle}>{track.title}</div>
        <div className={styles.trackArtist}>{track.artist}</div>
      </div>
      {track.album && <div className={styles.trackAlbum}>{track.album}</div>}
      <div className={styles.trackDuration}>
        {formatDuration(track.duration)}
      </div>
      <div className={styles.actions}>
        <button 
          onClick={toggleFavorite}
          className={styles.favoriteBtn}
          disabled={loading}
        >
          {isFavorite ? (
            <FaHeart style={{ color: '#1db954' }} />
          ) : (
            <FaRegHeart />
          )}
        </button>
        {showAddToPlaylist && (
          <button onClick={handleAddToPlaylist} className={styles.addBtn}>
            <FaPlus />
          </button>
        )}
        {showDelete && (
          <button onClick={handleDelete} className={styles.deleteBtn}>
            <FaTrash />
          </button>
        )}
        <button className={styles.playBtn}>
          <FaPlay />
        </button>
      </div>
    </div>
    </>
  )
}
