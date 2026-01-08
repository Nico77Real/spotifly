import { useState, useEffect } from 'react'
import { tracks, playlists } from '../utils/api'
import { usePlayerStore } from '../store/playerStore'
import { getCoverUrl } from '../utils/api'
import { FaPlay } from 'react-icons/fa'
import styles from './Home.module.css'

export default function Home() {
  const [recentTracks, setRecentTracks] = useState([])
  const [userPlaylists, setUserPlaylists] = useState([])
  const { playTrack } = usePlayerStore()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [tracksRes, playlistsRes] = await Promise.all([
        tracks.getAll(),
        playlists.getAll()
      ])
      setRecentTracks(tracksRes.data.slice(0, 10))
      setUserPlaylists(playlistsRes.data.slice(0, 6))
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handlePlayTrack = (track) => {
    playTrack(track, recentTracks)
  }

  return (
    <div className={styles.home}>
      <h1 className={styles.greeting}>
        {getGreeting()}
      </h1>

      {recentTracks.length > 0 && (
        <section className={styles.section}>
          <h2>Ascoltati di recente</h2>
          <div className={styles.grid}>
            {recentTracks.map((track) => (
              <div key={track.id} className={styles.card} onClick={() => handlePlayTrack(track)}>
                <img src={getCoverUrl(track)} alt={track.title} />
                <div className={styles.info}>
                  <h3>{track.title}</h3>
                  <p>{track.artist}</p>
                </div>
                <button className={styles.playBtn}>
                  <FaPlay />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {userPlaylists.length > 0 && (
        <section className={styles.section}>
          <h2>Le tue playlist</h2>
          <div className={styles.playlistGrid}>
            {userPlaylists.map((playlist) => (
              <a key={playlist.id} href={`/playlist/${playlist.id}`} className={styles.playlistCard}>
                <img 
                  src={playlist.cover_url || '/default-playlist.png'} 
                  alt={playlist.name} 
                />
                <h3>{playlist.name}</h3>
                <p>{playlist.description || 'Nessuna descrizione'}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {recentTracks.length === 0 && userPlaylists.length === 0 && (
        <div className={styles.empty}>
          <h2>👋 Benvenuto su Spotifly!</h2>
          <p>Inizia caricando i tuoi brani o cercando musica</p>
        </div>
      )}
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buongiorno'
  if (hour < 18) return 'Buon pomeriggio'
  return 'Buonasera'
}
