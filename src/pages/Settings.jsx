import { useState, useEffect } from 'react'
import { usePlayerStore } from '../store/playerStore'
import { FaVolumeUp, FaMusic, FaDesktop, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'
import { useAuthStore } from '../store/authStore'
import { users } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import styles from './Settings.module.css'

export default function Settings() {
  const navigate = useNavigate()
  const { volume, setVolume } = usePlayerStore()
  const { logout } = useAuthStore()
  const [user, setUser] = useState(null)
  const [audioQuality, setAudioQuality] = useState('high')
  const [crossfade, setCrossfade] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [normalizeVolume, setNormalizeVolume] = useState(false)

  useEffect(() => {
    loadUser()
    loadSettings()
  }, [])

  const loadUser = async () => {
    try {
      const response = await users.getMe()
      setUser(response.data)
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('spotifly-settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setAudioQuality(settings.audioQuality || 'high')
      setCrossfade(settings.crossfade || 0)
      setAutoplay(settings.autoplay !== false)
      setNormalizeVolume(settings.normalizeVolume || false)
    }
  }

  const saveSettings = () => {
    const settings = {
      audioQuality,
      crossfade,
      autoplay,
      normalizeVolume
    }
    localStorage.setItem('spotifly-settings', JSON.stringify(settings))
    alert('✅ Impostazioni salvate!')
  }

  const handleLogout = () => {
    if (confirm('Vuoi disconnetterti?')) {
      logout()
      navigate('/login')
    }
  }

  return (
    <div className={styles.settings}>
      <h1>Impostazioni</h1>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <FaUserCircle />
          <h2>Account</h2>
        </div>
        <div className={styles.card}>
          {user && (
            <>
              <div className={styles.row}>
                <span className={styles.label}>Nome utente</span>
                <span className={styles.value}>{user.username}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.label}>Email</span>
                <span className={styles.value}>{user.email}</span>
              </div>
            </>
          )}
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <FaSignOutAlt /> Disconnetti
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <FaVolumeUp />
          <h2>Audio</h2>
        </div>
        <div className={styles.card}>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <div className={styles.settingLabel}>Volume</div>
              <div className={styles.settingDescription}>Regola il volume generale</div>
            </div>
            <div className={styles.volumeControl}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className={styles.slider}
              />
              <span className={styles.volumeValue}>{Math.round(volume * 100)}%</span>
            </div>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <div className={styles.settingLabel}>Qualità audio</div>
              <div className={styles.settingDescription}>Qualità dello streaming</div>
            </div>
            <select 
              value={audioQuality} 
              onChange={(e) => setAudioQuality(e.target.value)}
              className={styles.select}
            >
              <option value="low">Bassa (96 kbps)</option>
              <option value="normal">Normale (160 kbps)</option>
              <option value="high">Alta (320 kbps)</option>
              <option value="lossless">Lossless (FLAC)</option>
            </select>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <div className={styles.settingLabel}>Crossfade</div>
              <div className={styles.settingDescription}>Dissolvenza incrociata tra brani (secondi)</div>
            </div>
            <div className={styles.crossfadeControl}>
              <input
                type="range"
                min="0"
                max="12"
                step="1"
                value={crossfade}
                onChange={(e) => setCrossfade(Number(e.target.value))}
                className={styles.slider}
              />
              <span className={styles.crossfadeValue}>{crossfade}s</span>
            </div>
          </div>

          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <div className={styles.settingLabel}>Normalizza volume</div>
              <div className={styles.settingDescription}>Mantieni un volume costante tra i brani</div>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={normalizeVolume}
                onChange={(e) => setNormalizeVolume(e.target.checked)}
              />
              <span className={styles.switchSlider}></span>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <FaMusic />
          <h2>Riproduzione</h2>
        </div>
        <div className={styles.card}>
          <div className={styles.settingRow}>
            <div className={styles.settingInfo}>
              <div className={styles.settingLabel}>Autoplay</div>
              <div className={styles.settingDescription}>Riproduci automaticamente brani simili</div>
            </div>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={autoplay}
                onChange={(e) => setAutoplay(e.target.checked)}
              />
              <span className={styles.switchSlider}></span>
            </label>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <FaDesktop />
          <h2>Applicazione</h2>
        </div>
        <div className={styles.card}>
          <div className={styles.row}>
            <span className={styles.label}>Versione</span>
            <span className={styles.value}>2.0.0</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Piattaforma</span>
            <span className={styles.value}>Electron Desktop</span>
          </div>
        </div>
      </div>

      <div className={styles.saveContainer}>
        <button onClick={saveSettings} className={styles.saveBtn}>
          Salva impostazioni
        </button>
      </div>
    </div>
  )
}
