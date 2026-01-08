import { useState, useEffect } from 'react'
import { playlists as playlistsApi } from '../utils/api'
import { FaTimes, FaPlus } from 'react-icons/fa'
import styles from './AddToPlaylistModal.module.css'

export default function AddToPlaylistModal({ trackId, onClose }) {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')

  useEffect(() => {
    loadPlaylists()
  }, [])

  const loadPlaylists = async () => {
    try {
      const response = await playlistsApi.getAll()
      setPlaylists(response.data)
    } catch (error) {
      console.error('Error loading playlists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await playlistsApi.addTrack(playlistId, trackId)
      alert('Brano aggiunto alla playlist!')
      onClose()
    } catch (error) {
      alert('Errore durante l\'aggiunta del brano')
    }
  }

  const handleCreateAndAdd = async () => {
    if (!newPlaylistName.trim()) return

    try {
      const createResponse = await playlistsApi.create({ name: newPlaylistName })
      await playlistsApi.addTrack(createResponse.data.id, trackId)
      alert('Playlist creata e brano aggiunto!')
      onClose()
    } catch (error) {
      alert('Errore durante la creazione della playlist')
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Aggiungi a playlist</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.content}>
          {showCreate ? (
            <div className={styles.createForm}>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Nome della playlist"
                autoFocus
              />
              <div className={styles.createButtons}>
                <button onClick={handleCreateAndAdd}>Crea e aggiungi</button>
                <button onClick={() => setShowCreate(false)}>Annulla</button>
              </div>
            </div>
          ) : (
            <>
              <button onClick={() => setShowCreate(true)} className={styles.createBtn}>
                <FaPlus /> Crea nuova playlist
              </button>

              {loading ? (
                <div className={styles.loading}>Caricamento...</div>
              ) : playlists.length === 0 ? (
                <div className={styles.empty}>Nessuna playlist disponibile</div>
              ) : (
                <div className={styles.playlistList}>
                  {playlists.map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => handleAddToPlaylist(playlist.id)}
                      className={styles.playlistItem}
                    >
                      <img
                        src={playlist.cover_url || '/default-playlist.png'}
                        alt={playlist.name}
                      />
                      <span>{playlist.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
