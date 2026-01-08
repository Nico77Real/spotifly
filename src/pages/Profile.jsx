import { useState, useEffect } from 'react'
import { users } from '../utils/api'
import { useAuthStore } from '../store/authStore'
import { FaUserCircle } from 'react-icons/fa'
import styles from './Profile.module.css'

export default function Profile() {
  const { user, setAuth } = useAuthStore()
  const [formData, setFormData] = useState({
    username: user?.username || '',
    avatar: user?.avatar || ''
  })
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await users.updateMe(formData)
      const response = await users.getMe()
      setAuth(localStorage.getItem('token'), response.data)
      setEditing(false)
    } catch (error) {
      alert('Errore durante l\'aggiornamento del profilo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {formData.avatar ? (
            <img src={formData.avatar} alt={formData.username} />
          ) : (
            <FaUserCircle />
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.type}>PROFILO</span>
          <h1 className={styles.username}>{formData.username}</h1>
          <p className={styles.email}>{user?.email}</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Impostazioni Profilo</h2>

          {editing ? (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label>Nome utente</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className={styles.field}>
                <label>URL Avatar</label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://esempio.com/avatar.jpg"
                />
              </div>

              <div className={styles.buttons}>
                <button type="submit" disabled={loading}>
                  {loading ? 'Salvataggio...' : 'Salva modifiche'}
                </button>
                <button type="button" onClick={() => setEditing(false)}>
                  Annulla
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.details}>
              <div className={styles.detailItem}>
                <span className={styles.label}>Nome utente:</span>
                <span className={styles.value}>{formData.username}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Email:</span>
                <span className={styles.value}>{user?.email}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.label}>Avatar:</span>
                <span className={styles.value}>
                  {formData.avatar ? 'Impostato' : 'Non impostato'}
                </span>
              </div>
              <button onClick={() => setEditing(true)} className={styles.editBtn}>
                Modifica profilo
              </button>
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2>Informazioni</h2>
          <p className={styles.infoText}>
            Benvenuto su Spotifly! Qui puoi gestire il tuo profilo e le tue impostazioni.
          </p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statValue}>🎵</div>
              <div className={styles.statLabel}>Ascolta la tua musica</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>📝</div>
              <div className={styles.statLabel}>Crea playlist</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>❤️</div>
              <div className={styles.statLabel}>Salva i preferiti</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
