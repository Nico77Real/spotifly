import { useState, useEffect } from 'react'
import { tracks } from '../utils/api'
import { FaPlus, FaUpload } from 'react-icons/fa'
import TrackRow from '../components/TrackRow'
import styles from './Library.module.css'

export default function Library() {
  const [activeTab, setActiveTab] = useState('tracks')
  const [allTracks, setAllTracks] = useState([])
  const [favorites, setFavorites] = useState([])
  const [showUpload, setShowUpload] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [tracksRes, favoritesRes] = await Promise.all([
        tracks.getAll(),
        tracks.getFavorites()
      ])
      setAllTracks(tracksRes.data)
      setFavorites(favoritesRes.data)
    } catch (error) {
      console.error('Error loading library:', error)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)

    try {
      await tracks.upload(formData)
      setShowUpload(false)
      loadData()
      e.target.reset()
      alert('✅ Brano caricato con successo!')
    } catch (error) {
      alert('❌ Errore durante il caricamento')
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter(f => 
      f.type.startsWith('audio/')
    )

    if (files.length === 0) {
      alert('⚠️ Seleziona solo file audio (MP3, FLAC, WAV, ecc.)')
      return
    }

    for (const file of files) {
      const formData = new FormData()
      formData.append('audio', file)
      
      const fileName = file.name.replace(/\.[^/.]+$/, "")
      const parts = fileName.split('-')
      
      formData.append('title', parts[parts.length - 1]?.trim() || fileName)
      formData.append('artist', parts[0]?.trim() || 'Unknown Artist')
      formData.append('duration', 0)

      try {
        await tracks.upload(formData)
      } catch (error) {
        console.error('Upload error:', error)
      }
    }

    loadData()
    alert(`✅ ${files.length} brani caricati!`)
  }

  const handleDelete = async (id) => {
    if (confirm('Sei sicuro di voler eliminare questo brano?')) {
      try {
        await tracks.delete(id)
        loadData()
      } catch (error) {
        alert('Errore durante l\'eliminazione')
      }
    }
  }

  const currentTracks = activeTab === 'favorites' ? favorites : allTracks

  return (
    <div 
      className={styles.library}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <h1>La tua libreria</h1>

      <div className={styles.tabs}>
        <button
          className={activeTab === 'tracks' ? styles.activeTab : ''}
          onClick={() => setActiveTab('tracks')}
        >
          Tutti i brani
        </button>
        <button
          className={activeTab === 'favorites' ? styles.activeTab : ''}
          onClick={() => setActiveTab('favorites')}
        >
          Preferiti
        </button>
      </div>

      {isDragging && (
        <div className={styles.dropZone}>
          <FaUpload size={48} />
          <h2>Rilascia i file audio qui</h2>
          <p>Supportati: MP3, FLAC, WAV, OGG</p>
        </div>
      )}

      <div className={styles.actionButtons}>
        <button onClick={() => setShowUpload(!showUpload)} className={styles.uploadBtn}>
          <FaPlus /> Carica brano
        </button>
      </div>

      {showUpload && (
        <form onSubmit={handleUpload} className={styles.uploadForm}>
          <h3>Carica un nuovo brano</h3>
          <input type="text" name="title" placeholder="Titolo" required />
          <input type="text" name="artist" placeholder="Artista" required />
          <input type="text" name="album" placeholder="Album" />
          <input type="number" name="duration" placeholder="Durata (secondi)" />
          <input type="file" name="audio" accept="audio/*" required />
          <input type="file" name="cover" accept="image/*" />
          <div className={styles.formButtons}>
            <button type="submit">Carica</button>
            <button type="button" onClick={() => setShowUpload(false)}>Annulla</button>
          </div>
        </form>
      )}

      <div className={styles.trackList}>
        {currentTracks.map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            index={index}
            queue={currentTracks}
            showDelete={activeTab === 'tracks'}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {currentTracks.length === 0 && (
        <div className={styles.empty}>
          <h2>Nessun brano trovato</h2>
          <p>{activeTab === 'favorites' ? 'Aggiungi brani ai preferiti' : 'Carica il tuo primo brano'}</p>
        </div>
      )}
    </div>
  )
}
