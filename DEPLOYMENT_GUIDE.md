# 📦 Guida al Deploy e Distribuzione di Spotifly 2.0

## 🎯 Panoramica

Questa guida ti aiuterà a trasformare Spotifly in un'applicazione desktop professionale distribuibile, con aggiornamenti automatici proprio come Spotify.

## 📝 Cosa Abbiamo Preparato

### File Creati:
1. **ISTRUZIONI_BUILD.md** - Guida completa per build e packaging
2. **electron/main-updated.js** - Main file con auto-updater integrato
3. **package-updated.json** - Package.json ottimizzato per produzione
4. **.github/workflows/build.yml** - CI/CD automatico con GitHub Actions
5. **public/icon-placeholder.txt** - Istruzioni per creare le icone

## 🚀 Passi per Deploy Completo

### FASE 1: Preparazione Ambiente (5 minuti)

#### 1.1 Pulisci dipendenze obsolete
```bash
cd "c:\Users\User\Desktop\Spotifly 2.0"
npm uninstall ytdl-core @distube/ytdl-core play-dl
npm install electron-updater electron-log
```

#### 1.2 Sostituisci i file di configurazione
```bash
# Backup dei file originali
copy package.json package.json.backup
copy electron\main.js electron\main.js.backup

# Usa i nuovi file
copy package-updated.json package.json
copy electron\main-updated.js electron\main.js
```

#### 1.3 Crea le icone (IMPORTANTE!)
Segui le istruzioni in `public/icon-placeholder.txt` per creare:
- `public/icon.ico` (Windows)
- `public/icon.icns` (macOS)
- `public/icon.png` (Linux)

**Metodo Rapido:**
- Vai su https://www.icoconverter.com/
- Carica un'immagine 512x512 px con tema musicale
- Scarica .ico e .png
- Per .icns usa https://cloudconvert.com/png-to-icns

### FASE 2: Build Locale (10 minuti)

#### 2.1 Build frontend
```bash
npm run build
```
✅ Verifica che venga creata la cartella `build/` con i file React

#### 2.2 Build installer Windows
```bash
npm run package:win
```
✅ Verifica che venga creato `dist/Spotifly-Setup-2.0.0.exe`

#### 2.3 Test installer
1. Vai in `dist/`
2. Doppio click su `Spotifly-Setup-2.0.0.exe`
3. Installa l'applicazione
4. Avvia da desktop o menu Start
5. Verifica tutte le funzioni:
   - ✅ Login/Register
   - ✅ Upload brani (drag & drop)
   - ✅ Player funziona
   - ✅ Playlist create/modifica
   - ✅ Favorites
   - ✅ Queue
   - ✅ Settings

### FASE 3: Setup Repository GitHub (15 minuti)

#### 3.1 Crea repository
1. Vai su https://github.com/new
2. Nome: `spotifly`
3. Description: `Desktop music streaming app like Spotify`
4. Visibility: Public (per auto-update gratuito)
5. Click "Create repository"

#### 3.2 Configura Git locale
```bash
cd "c:\Users\User\Desktop\Spotifly 2.0"

# Inizializza git se non già fatto
git init

# Crea .gitignore
echo node_modules/ > .gitignore
echo build/ >> .gitignore
echo dist/ >> .gitignore
echo *.db >> .gitignore
echo server/uploads/* >> .gitignore
echo .env >> .gitignore

# Commit iniziale
git add .
git commit -m "Initial commit - Spotifly 2.0"

# Collega a GitHub (sostituisci YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/spotifly.git
git branch -M main
git push -u origin main
```

#### 3.3 Aggiorna package.json
Apri `package.json` e modifica la sezione `publish`:
```json
"publish": {
  "provider": "github",
  "owner": "YOUR_USERNAME",  // <-- Il tuo username GitHub
  "repo": "spotifly",
  "private": false
}
```

### FASE 4: Prima Release (10 minuti)

#### 4.1 Crea tag versione
```bash
git tag v2.0.0
git push origin v2.0.0
```

#### 4.2 Build release
```bash
npm run build
npm run package:win
```

#### 4.3 Crea GitHub Release
1. Vai su `https://github.com/YOUR_USERNAME/spotifly/releases`
2. Click "Create a new release"
3. Tag: `v2.0.0`
4. Release title: `Spotifly v2.0.0 - Prima Release`
5. Description:
   ```
   ## 🎵 Spotifly 2.0.0 - Prima Release
   
   ### Funzionalità
   - ✅ Player audio completo
   - ✅ Upload drag & drop
   - ✅ Gestione playlist
   - ✅ Sistema favorites
   - ✅ Queue management
   - ✅ Settings personalizzabili
   - ✅ Auto-update integrato
   
   ### Download
   Scarica l'installer per Windows qui sotto ⬇️
   ```
6. Upload file da `dist/`:
   - `Spotifly-Setup-2.0.0.exe`
   - `latest.yml`
7. Click "Publish release"

### FASE 5: Auto-Update Setup (5 minuti)

#### 5.1 Verifica configurazione
L'auto-updater è già configurato! Controlla che:
- `electron/main.js` usa il codice con `autoUpdater`
- `package.json` ha `electron-updater` nelle dependencies
- `package.json` ha la sezione `publish` configurata

#### 5.2 Come funziona
1. Utente installa `Spotifly-Setup-2.0.0.exe`
2. All'avvio, l'app controlla GitHub Releases
3. Se trova `v2.0.1`, scarica automaticamente
4. Mostra notifica all'utente
5. Al riavvio, installa l'aggiornamento

#### 5.3 Test auto-update
```bash
# Incrementa versione
# Modifica package.json: "version": "2.0.1"

# Build nuova versione
npm run build
npm run package:win

# Crea tag e release
git add .
git commit -m "Update to v2.0.1"
git tag v2.0.1
git push origin v2.0.1

# Crea release su GitHub e carica i nuovi file
# L'app installata rileverà automaticamente l'aggiornamento!
```

### FASE 6: CI/CD Automatico (Opzionale, 10 minuti)

#### 6.1 Setup GitHub Actions
Il file `.github/workflows/build.yml` è già pronto!

Quando fai push di un tag:
```bash
git tag v2.0.1
git push origin v2.0.1
```

GitHub Actions automaticamente:
1. ✅ Installa dipendenze
2. ✅ Build frontend
3. ✅ Build installer per Windows, Mac, Linux
4. ✅ Crea release su GitHub
5. ✅ Upload installer

#### 6.2 Configura secrets (se necessario)
1. Vai su `Settings → Secrets → Actions`
2. `GH_TOKEN` è automatico (già disponibile)

## 🔄 Workflow Aggiornamenti Futuri

### Quando aggiungi nuove feature:

1. **Sviluppa localmente**
   ```bash
   npm start  # testa in dev mode
   ```

2. **Incrementa versione** in `package.json`
   ```json
   "version": "2.1.0"  // Nuovo numero
   ```

3. **Commit e tag**
   ```bash
   git add .
   git commit -m "Add new feature: ..."
   git tag v2.1.0
   git push origin main
   git push origin v2.1.0
   ```

4. **GitHub Actions fa tutto automaticamente!**
   - Build
   - Release
   - Upload installer

5. **Gli utenti ricevono l'aggiornamento automaticamente**

## 📊 Dashboard Utente

### Come vedere quanti utenti hai
1. **GitHub Insights**
   - `Insights → Traffic` mostra download
   - `Releases` mostra download per versione

2. **Aggiungere analytics (opzionale)**
   ```bash
   npm install mixpanel electron-google-analytics
   ```

## 🌐 Backend per Produzione (Prossimo step)

Attualmente il backend gira su `localhost:3001`. Per produzione:

### Opzione 1: Embedded Server (Raccomandato)
L'app include già il server. Funziona offline!

### Opzione 2: Cloud Backend
Deploy server su:
- **Railway.app** (facile, gratis iniziale)
- **Heroku** (gratis tier disponibile)
- **AWS/Azure** (professionale)

Poi modifica `src/utils/api.js`:
```javascript
const API_BASE_URL = 'https://your-api.railway.app'
```

## 🎨 Personalizzazioni Aggiuntive

### Splash Screen
Crea `public/splash.html` per loading screen

### Menu Personalizzato
Aggiungi menu custom in `electron/main.js`:
```javascript
const { Menu } = require('electron');
const template = [...]; // tuo menu
Menu.setApplicationMenu(Menu.buildFromTemplate(template));
```

### Notifiche Desktop
```javascript
const { Notification } = require('electron');
new Notification({
  title: 'Spotifly',
  body: 'Nuovo brano in riproduzione'
}).show();
```

## 🐛 Troubleshooting Comune

### Build fallisce
```bash
# Pulisci tutto e riparti
rm -rf node_modules build dist
npm install
npm run build
npm run package:win
```

### Auto-update non funziona
- ✅ Verifica che app sia installata (non in dev mode)
- ✅ Controlla che GitHub release sia pubblica
- ✅ Verifica internet connection
- ✅ Guarda logs in `%APPDATA%/Spotifly/logs`

### Icone non appaiono
- ✅ Verifica percorsi in package.json
- ✅ Assicurati che file icona esistano
- ✅ Rebuilda completamente

## 📈 Metriche di Successo

Dopo il deploy, monitora:
- **Downloads**: Releases → Assets downloads
- **Stars**: Persone che stellano il repo
- **Issues**: Bug report degli utenti
- **Feedback**: Commenti e reviews

## 🎯 Checklist Finale

Prima di pubblicare pubblicamente:

- [ ] Tutte le funzioni testate e funzionanti
- [ ] Icone create e funzionanti
- [ ] README.md completo con screenshot
- [ ] LICENSE file aggiunto
- [ ] GitHub repository pubblico
- [ ] Prima release v2.0.0 pubblicata
- [ ] Auto-updater testato
- [ ] Backend accessibile (locale o cloud)
- [ ] .gitignore configurato (no secrets)
- [ ] Link download nel README

## 🚀 Sei Pronto!

Congratulazioni! Hai ora:
- ✅ Un'app desktop professionale
- ✅ Sistema di aggiornamenti automatici
- ✅ Build automatizzata con CI/CD
- ✅ Distribuzione su GitHub

**Spotifly è pronto per il mondo! 🎵**

## 📞 Support

Per problemi o domande:
1. Controlla ISTRUZIONI_BUILD.md
2. Leggi docs Electron Builder: https://www.electron.build/
3. Cerca su GitHub Issues: electron-builder/electron-builder

---

**Made with ❤️ for music lovers**
