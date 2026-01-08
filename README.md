# 🎵 Spotifly 2.0

Un'applicazione desktop per lo streaming musicale simile a Spotify, costruita con Electron, React e Node.js.

## ✨ Funzionalità

- 🔐 **Autenticazione**: Registrazione e login completo con JWT
- 🎵 **Player Audio Completo**: 
  - Riproduzione con controlli play/pause, skip, shuffle, repeat
  - Progress bar interattiva (clicca per cercare)
  - Controllo volume funzionante
  - Visualizzazione brano corrente
  - Gestione coda di riproduzione
- 📚 **Libreria Musicale**: Gestione completa della tua collezione
- 📝 **Playlist**: 
  - Crea, modifica ed elimina playlist
  - Aggiungi/rimuovi brani con modal interattivo
  - Cover personalizzate
- 🔍 **Ricerca**: Cerca brani, artisti e album in tempo reale
- ❤️ **Preferiti Completi**: 
  - Aggiungi/rimuovi brani dai preferiti
  - Pulsante cuore su ogni traccia
  - Sincronizzazione in tempo reale
- 📤 **Upload**: Carica i tuoi file audio locali con copertine
- 🎬 **Integrazione YouTube Funzionante**: 
  - Cerca e aggiungi brani da YouTube
  - Streaming audio diretto tramite proxy server
  - ytdl-core per estrazione audio
- 👤 **Profilo Utente**: Gestisci il tuo profilo e avatar
- 🎨 **UI Moderna**: Design professionale simile a Spotify con tema scuro
- 🎯 **Click & Play**: Click su qualsiasi brano per riprodurlo immediatamente

## 🛠️ Stack Tecnologico

### Frontend
- React 18
- React Router DOM
- Zustand (State Management)
- React Icons
- Vite (Build Tool)

### Backend
- Node.js
- Express
- SQLite
- JWT Authentication
- Multer (File Upload)
- Bcrypt (Password Hashing)

### Desktop
- Electron

## 📋 Prerequisiti

- Node.js (v16 o superiore)
- npm o yarn

## 🚀 Installazione

1. **Installa le dipendenze**:
```bash
npm install
```

2. **Avvia il server backend**:
```bash
npm run server
```

3. **Avvia l'applicazione React** (in un nuovo terminale):
```bash
npm run dev
```

4. **Avvia Electron** (in un terzo terminale):
```bash
npm run electron
```

**Oppure avvia tutto insieme**:
```bash
npm run electron-dev
```

## 📖 Come Usare

### Prima Configurazione

1. Apri l'applicazione
2. Registra un nuovo account
3. Effettua il login

### Caricare Musica

#### Carica File Locali
1. Vai su "La tua libreria"
2. Clicca su "Carica brano locale"
3. Compila il form con titolo, artista, album
4. Seleziona il file audio e opzionalmente una copertina
5. Clicca su "Carica"

#### Aggiungi da YouTube
1. Vai su "La tua libreria"
2. Clicca su "Aggiungi da YouTube"
3. Cerca un brano (artista, titolo, ecc.)
4. Clicca su "Aggiungi" sul risultato desiderato
5. Il brano viene aggiunto e può essere riprodotto immediatamente!

**Come funziona**:
- Usa l'API di YouTube per cercare video musicali
- Il server usa ytdl-core per estrarre l'audio
- Lo streaming avviene tramite proxy server
- Non è necessario scaricare i file

**Configurazione API YouTube**:
- L'API key è già configurata nel file
- Oppure usa la tua: apri `src/components/YouTubeSearch.jsx`
- Sostituisci la chiave esistente con la tua
- Ottieni una key gratuita su [Google Cloud Console](https://console.cloud.google.com)

### Gestire Playlist

1. **Creare una playlist**:
   - Clicca su "Crea Playlist" nella sidebar
   - Inserisci un nome
   - La playlist è pronta!

2. **Aggiungere brani**:
   - Clicca sul pulsante "+" su qualsiasi brano
   - Seleziona la playlist dal modal
   - Oppure crea una nuova playlist direttamente

3. **Modificare playlist**:
   - Apri la playlist
   - Clicca "Modifica" per cambiare nome/descrizione/cover
   - Rimuovi brani con il pulsante cestino

4. **Ascoltare playlist**:
   - Clicca "Riproduci" per ascoltare tutta la playlist
   - Oppure clicca su un brano specifico

### Ascoltare Musica

1. **Clicca su qualsiasi brano** per riprodurlo immediatamente
2. **Usa i controlli nel player** (in basso):
   - ▶️ Play/Pausa
   - ⏮️⏭️ Brano precedente/successivo
   - 🔀 Shuffle (casuale)
   - 🔁 Repeat (off/all/one)
   - 🔊 Volume (slide per regolare)
   - 💚 Preferiti (aggiungi/rimuovi)
3. **Progress bar**: Clicca sulla barra per andare a un punto specifico
4. **Gestione coda**: I brani vengono aggiunti automaticamente alla coda

## 📁 Struttura del Progetto

```
Spotifly 2.0/
├── electron/          # Processo principale Electron
│   └── main.js
├── server/            # Backend Express
│   ├── index.js
│   ├── database.js
│   ├── middleware/
│   └── routes/
├── src/               # Frontend React
│   ├── components/    # Componenti riutilizzabili
│   ├── pages/         # Pagine dell'app
│   ├── store/         # State management (Zustand)
│   └── utils/         # Utilità e API
└── public/            # Asset statici
```

## 🔧 Script Disponibili

- `npm run dev` - Avvia il dev server React
- `npm run build` - Build dell'app React
- `npm run server` - Avvia il server backend
- `npm run electron` - Avvia Electron
- `npm run electron-dev` - Avvia tutto insieme
- `npm run package` - Crea pacchetto distribuibile

## 🎨 Personalizzazione

### Cambiare i Colori
I colori principali sono definiti nei file CSS module. Il colore primario Spotify (#1db954) può essere sostituito con il tuo colore preferito.

### Aggiungere Nuove Funzionalità
1. Backend: Aggiungi route in `server/routes/`
2. Frontend: Crea componenti in `src/components/` o pagine in `src/pages/`
3. State: Gestisci lo stato globale in `src/store/`

## ⚠️ Note Importanti

- Il database SQLite viene creato automaticamente in `server/spotifly.db`
- I file caricati vengono salvati in `server/uploads/`
- **Cambia il `JWT_SECRET` in produzione** (file `server/middleware/auth.js`)
- L'integrazione YouTube richiede `ytdl-core` (incluso nelle dipendenze)
- Lo streaming YouTube passa attraverso il server proxy per compatibilità browser

## 🔧 Funzionalità Fixate nella v2.0

- ✅ **Progress bar interattiva**: Ora puoi cliccare sulla barra per cercare nella canzone
- ✅ **Volume funzionante**: Il controllo volume ora regola correttamente l'audio
- ✅ **Preferiti completi**: Sistema completo di gestione preferiti con pulsante su ogni traccia
- ✅ **YouTube playback**: I brani da YouTube ora si riproducono correttamente tramite proxy server
- ✅ **Click sui brani**: Click ovunque su un brano per riprodurlo
- ✅ **Modal playlist**: Nuovo modal per aggiungere brani alle playlist
- ✅ **Componente TrackRow**: Componente unificato per tutte le liste di brani
- ✅ **Gestione coda migliorata**: Migliore gestione della coda di riproduzione

## 🐛 Troubleshooting

### Il server non si avvia
- Verifica che la porta 3001 non sia già in uso
- Controlla i log nella console

### L'audio non si riproduce
- Verifica che il file sia in un formato supportato (MP3, WAV, OGG)
- Controlla che il percorso del file sia corretto

### Electron non si apre
- Assicurati che il server React sia avviato (porta 5173)
- Controlla la console per errori

## 📄 Licenza

MIT

## 👨‍💻 Sviluppo

Questo progetto è stato creato come clone di Spotify per scopi educativi.

---

**Buon ascolto! 🎧**
