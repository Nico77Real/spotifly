import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import styles from './AddToPlaylistModal.module.css'

export default function CreatePlaylistModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    try {
      await onCreate(name.trim())
      onClose()
    } catch (error) {
      console.error('Error creating playlist:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className={styles.header}>
          <h2>Crea Playlist</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.content}>
          <form onSubmit={handleSubmit} className={styles.createForm}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome della playlist"
              autoFocus
              disabled={loading}
            />
            <div className={styles.createButtons}>
              <button type="submit" disabled={loading || !name.trim()}>
                {loading ? 'Creazione...' : 'Crea'}
              </button>
              <button type="button" onClick={onClose}>
                Annulla
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
