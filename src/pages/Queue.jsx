import { usePlayerStore } from '../store/playerStore'
import { FaPlay, FaTimes } from 'react-icons/fa'
import { getCoverUrl } from '../utils/api'
import styles from './Queue.module.css'

export default function Queue() {
  const { queue, queueIndex, currentTrack, playTrack, setQueue } = usePlayerStore()

  const handlePlayTrack = (track, index) => {
    playTrack(track, queue)
  }

  const handleRemoveFromQueue = (index) => {
    const newQueue = queue.filter((_, i) => i !== index)
    setQueue(newQueue)
  }

  const handleClearQueue = () => {
    if (confirm('Vuoi svuotare la coda di riproduzione?')) {
      setQueue([])
    }
  }

  return (
    <div className={styles.queue}>
      <div className={styles.header}>
        <h1>Coda di riproduzione</h1>
        {queue.length > 0 && (
          <button onClick={handleClearQueue} className={styles.clearBtn}>
            Svuota coda
          </button>
        )}
      </div>

      {currentTrack && (
        <div className={styles.nowPlaying}>
          <h2>In riproduzione</h2>
          <div className={styles.currentTrack}>
            <img src={getCoverUrl(currentTrack)} alt={currentTrack.title} />
            <div className={styles.trackInfo}>
              <div className={styles.title}>{currentTrack.title}</div>
              <div className={styles.artist}>{currentTrack.artist}</div>
            </div>
            <div className={styles.playingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.nextUp}>
        <h2>Prossimi brani ({queue.length - queueIndex - 1})</h2>
        <div className={styles.trackList}>
          {queue.slice(queueIndex + 1).map((track, index) => {
            const actualIndex = queueIndex + 1 + index
            return (
              <div key={`${track.id}-${actualIndex}`} className={styles.queueTrack}>
                <div className={styles.trackNumber}>{index + 1}</div>
                <img src={getCoverUrl(track)} alt={track.title} className={styles.cover} />
                <div className={styles.info}>
                  <div className={styles.trackTitle}>{track.title}</div>
                  <div className={styles.trackArtist}>{track.artist}</div>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => handlePlayTrack(track, actualIndex)} className={styles.playBtn}>
                    <FaPlay />
                  </button>
                  <button onClick={() => handleRemoveFromQueue(actualIndex)} className={styles.removeBtn}>
                    <FaTimes />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {queue.length - queueIndex - 1 === 0 && (
          <div className={styles.empty}>
            <p>Nessun brano in coda</p>
            <p>Aggiungi brani dalla libreria o dalle playlist</p>
          </div>
        )}
      </div>
    </div>
  )
}
