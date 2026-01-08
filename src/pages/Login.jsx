import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth } from '../utils/api'
import { useAuthStore } from '../store/authStore'
import styles from './Auth.module.css'

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await auth.login(formData.email, formData.password)
      setAuth(response.data.token, response.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Errore durante il login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.logo}>🎵 Spotifly</h1>
        <h2 className={styles.title}>Accedi al tuo account</h2>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
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
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Accesso...' : 'Accedi'}
          </button>
        </form>

        <div className={styles.footer}>
          Non hai un account? <Link to="/register">Registrati</Link>
        </div>
      </div>
    </div>
  )
}
