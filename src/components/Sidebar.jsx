import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaSearch, FaBook, FaPlus, FaHeart, FaListUl, FaCog } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { playlists } from '../utils/api'
import CreatePlaylistModal from './CreatePlaylistModal'
import styles from './Sidebar.module.css'

export default function Sidebar({ width }) {
  const location = useLocation()
  const [userPlaylists, setUserPlaylists] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadPlaylists()
  }, [])

  const loadPlaylists = async () => {
    try {
      const response = await playlists.getAll()
      setUserPlaylists(response.data)
    } catch (error) {
      console.error('Error loading playlists:', error)
    }
  }

  const handleCreatePlaylist = async (name) => {
    try {
      await playlists.create({ name })
      await loadPlaylists()
    } catch (error) {
      console.error('Errore nella creazione della playlist:', error)
      throw error
    }
  }

  return (
    <>
      {showCreateModal && (
        <CreatePlaylistModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreatePlaylist}
        />
      )}
      <div className={styles.sidebar} style={{ width }}>
        <div className={styles.logo}>
          <h1>🎵 Spotifly</h1>
        </div>

        <nav className={styles.nav}>
          <Link to="/" className={location.pathname === '/' ? styles.active : ''}>
            <FaHome /> Home
          </Link>
          <Link to="/search" className={location.pathname === '/search' ? styles.active : ''}>
            <FaSearch /> Cerca
          </Link>
          <Link to="/library" className={location.pathname === '/library' ? styles.active : ''}>
            <FaBook /> La tua libreria
          </Link>
          <Link to="/queue" className={location.pathname === '/queue' ? styles.active : ''}>
            <FaListUl /> Coda
          </Link>
          <Link to="/settings" className={location.pathname === '/settings' ? styles.active : ''}>
            <FaCog /> Impostazioni
          </Link>
        </nav>

        <div className={styles.divider}></div>

        <div className={styles.playlists}>
          <button onClick={() => setShowCreateModal(true)} className={styles.createBtn}>
            <FaPlus /> Crea Playlist
          </button>
          
          <Link to="/library?tab=favorites" className={styles.favoritesBtn}>
            <FaHeart /> Brani che ti piacciono
          </Link>

          <div className={styles.playlistList}>
            {userPlaylists.map(playlist => (
              <Link 
                key={playlist.id} 
                to={`/playlist/${playlist.id}`}
                className={location.pathname === `/playlist/${playlist.id}` ? styles.active : ''}
              >
                {playlist.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
