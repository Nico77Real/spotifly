import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { playlists } from '../utils/api'
import { usePlayerStore } from '../store/playerStore'
import { FaPlay, FaTrash, FaEdit } from 'react-icons/fa'
import TrackRow from '../components/TrackRow'
import styles from './Playlist.module.css'

export default function Playlist() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [playlist, setPlaylist] = useState(null)
  const [tracks, setTracks] = useState([])
  const [editing, setEditing] = useState(false)
  const { playTrack } = usePlayerStore()

  useEffect(() => {
    loadPlaylist()
  }, [id])

  const loadPlaylist = async () => {
    try {
      const response = await playlists.getById(id)
      setPlaylist(response.data)
      setTracks(response.data.tracks || [])
    } catch (error) {
      console.error('Error loading playlist:', error)
    }
  }

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks)
    }
  }

  const handleRemoveTrack = async (trackId) => {
    try {
      await playlists.removeTrack(id, trackId)
      loadPlaylist()
    } catch (error) {
      alert('Errore durante la rimozione del brano')
    }
  }

  const handleUpdatePlaylist = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      cover_url: formData.get('cover_url')
    }

    try {
      await playlists.update(id, data)
      loadPlaylist()
      setEditing(false)
    } catch (error) {
      alert('Errore durante l\'aggiornamento')
    }
  }

  const handleDeletePlaylist = async () => {
    if (confirm('Sei sicuro di voler eliminare questa playlist?')) {
      try {
        await playlists.delete(id)
        navigate('/library')
      } catch (error) {
        alert('Errore durante l\'eliminazione')
      }
    }
  }

  if (!playlist) {
    return <div className={styles.loading}>Caricamento...</div>
  }

  return (
    <div className={styles.playlist}>
      <div className={styles.header}>
        <img
          src={playlist.cover_url || '/default-playlist.png'}
          alt={playlist.name}
          className={styles.cover}
        />
        <div className={styles.info}>
          <span className={styles.type}>PLAYLIST</span>
          {editing ? (
            <form onSubmit={handleUpdatePlaylist} className={styles.editForm}>
              <input
                type="text"
                name="name"
                defaultValue={playlist.name}
                required
                className={styles.editTitle}
              />
              <textarea
                name="description"
                defaultValue={playlist.description}
                placeholder="Descrizione"
                className={styles.editDescription}
              />
              <input
                type="text"
                name="cover_url"
                defaultValue={playlist.cover_url}
                placeholder="URL immagine di copertina"
                className={styles.editCover}
              />
              <div className={styles.editButtons}>
                <button type="submit">Salva</button>
                <button type="button" onClick={() => setEditing(false)}>Annulla</button>
              </div>
            </form>
          ) : (
            <>
              <h1 className={styles.title}>{playlist.name}</h1>
              <p className={styles.description}>{playlist.description || 'Nessuna descrizione'}</p>
              <div className={styles.meta}>
                {tracks.length} {tracks.length === 1 ? 'brano' : 'brani'}
              </div>
            </>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={handlePlayAll} className={styles.playAllBtn} disabled={tracks.length === 0}>
          <FaPlay /> Riproduci
        </button>
        <button onClick={() => setEditing(true)} className={styles.editBtn}>
          <FaEdit /> Modifica
        </button>
        <button onClick={handleDeletePlaylist} className={styles.deleteBtn}>
          <FaTrash /> Elimina
        </button>
      </div>

      <div className={styles.trackList}>
        {tracks.map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            index={index}
            queue={tracks}
            showDelete={true}
            onDelete={handleRemoveTrack}
          />
        ))}
      </div>

      {tracks.length === 0 && (
        <div className={styles.empty}>
          <h2>Questa playlist è vuota</h2>
          <p>Aggiungi brani dalla libreria o dalla ricerca</p>
        </div>
      )}
    </div>
  )
}
