import { useState } from 'react'
import { FaYoutube, FaPlus } from 'react-icons/fa'
import { tracks } from '../utils/api'
import styles from './YouTubeSearch.module.css'

export default function YouTubeSearch({ onTrackAdded }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState({})

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=10&q=${encodeURIComponent(query)}&key=AIzaSyBmeUBEuejn_8LMl7q1BghR97S4HEDOmdI`
      )
      const data = await response.json()
      
      if (data.items) {
        setResults(data.items.map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          artist: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium.url
        })))
      }
    } catch (error) {
      console.error('YouTube search error:', error)
      alert('Errore durante la ricerca su YouTube. Assicurati di aver configurato una API key valida.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTrack = async (result) => {
    setDownloading(prev => ({ ...prev, [result.id]: true }))
    
    try {
      const trackData = {
        title: result.title,
        artist: result.artist,
        source: 'youtube',
        external_id: result.id,
        cover_url: result.thumbnail,
        duration: 0
      }

      await tracks.addExternal(trackData)
      alert('Brano scaricato e aggiunto alla libreria!')
      if (onTrackAdded) onTrackAdded()
      setResults(prev => prev.filter(r => r.id !== result.id))
    } catch (error) {
      alert('Errore durante il download del brano. Riprova.')
      console.error('Download error:', error)
    } finally {
      setDownloading(prev => {
        const newState = { ...prev }
        delete newState[result.id]
        return newState
      })
    }
  }

  return (
    <div className={styles.youtubeSearch}>
      <div className={styles.header}>
        <FaYoutube className={styles.icon} />
        <h3>Cerca su YouTube</h3>
      </div>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca brani su YouTube..."
          className={styles.searchInput}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Ricerca...' : 'Cerca'}
        </button>
      </form>

      {results.length > 0 && (
        <div className={styles.results}>
          {results.map((result) => (
            <div key={result.id} className={styles.resultItem}>
              <img src={result.thumbnail} alt={result.title} />
              <div className={styles.resultInfo}>
                <div className={styles.resultTitle}>{result.title}</div>
                <div className={styles.resultArtist}>{result.artist}</div>
              </div>
              <button 
                onClick={() => handleAddTrack(result)} 
                className={styles.addBtn}
                disabled={downloading[result.id]}
              >
                {downloading[result.id] ? (
                  <>📥 Download...</>
                ) : (
                  <><FaPlus /> Aggiungi</>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
