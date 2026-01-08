import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { search } from '../utils/api'
import TrackRow from '../components/TrackRow'
import styles from './Search.module.css'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await search.query(query)
      setResults(response.data.tracks)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.search}>
      <h1>Cerca</h1>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cosa vuoi ascoltare?"
            className={styles.searchInput}
          />
        </div>
      </form>

      {loading && <div className={styles.loading}>Ricerca in corso...</div>}

      {results.length > 0 && (
        <div className={styles.results}>
          <h2>Risultati</h2>
          <div className={styles.trackList}>
            {results.map((track, index) => (
              <TrackRow
                key={track.id}
                track={track}
                index={index}
                queue={results}
                showAddToPlaylist={true}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className={styles.noResults}>
          <h2>Nessun risultato trovato</h2>
          <p>Prova a cercare con parole chiave diverse</p>
        </div>
      )}
    </div>
  )
}
