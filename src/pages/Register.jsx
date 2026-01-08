import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../utils/api'
import { useAuthStore } from '../store/authStore'
import styles from './Auth.module.css'

export default function Register() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await auth.register(formData.username, formData.email, formData.password)
      setAuth(response.data.token, response.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Errore durante la registrazione')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.logo}>🎵 Spotifly</h1>
        <h2 className={styles.title}>Crea il tuo account</h2>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Nome utente</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              placeholder="Il tuo nome utente"
            />
          </div>

          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="esempio@email.com"
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="••••••••"
              minLength="6"
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Registrazione...' : 'Registrati'}
          </button>
        </form>

        <div className={styles.footer}>
          Hai già un account? <Link to="/login">Accedi</Link>
        </div>
      </div>
    </div>
  )
}
