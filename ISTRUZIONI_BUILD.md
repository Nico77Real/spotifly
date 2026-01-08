# 🚀 Istruzioni per Build e Distribuzione Spotifly 2.0

## 📋 Checklist Pre-Build

### 1. Pulizia Dipendenze YouTube (Opzionale)
Le vecchie dipendenze YouTube non sono più utilizzate. Per rimuoverle:

```bash
npm uninstall ytdl-core @distube/ytdl-core
```

### 2. Installare electron-updater
```bash
npm install electron-updater
```

### 3. Aggiornare package.json

Modifica il file `package.json` e:

**Rimuovi** dalle dependencies:
- `"@distube/ytdl-core": "^4.16.12"`
- `"ytdl-core": "^4.11.5"`

**Aggiungi** nelle dependencies:
- `"electron-updater": "^6.1.7"`

**Aggiungi** configurazione publish nel blocco "build":
```json
"build": {
  "appId": "com.spotifly.app",
  "productName": "Spotifly",
  "directories": {
    "output": "dist"
  },
  "files": [
    "build/**/*",
    "electron/**/*",
    "server/**/*",
    "node_modules/**/*",
    "public/**/*",
    "package.json"
  ],
  "win": {
    "target": "nsis",
    "icon": "public/icon.ico"
  },
  "mac": {
    "target": "dmg",
    "icon": "public/icon.icns"
  },
  "linux": {
    "target": "AppImage",
    "icon": "public/icon.png"
  },
  "publish": {
    "provider": "github",
    "owner": "YOUR_USERNAME",
    "repo": "spotifly"
  }
}
```

### 4. Aggiornare electron/main.js con Auto-Update

Sostituisci il contenuto di `electron/main.js` con questo codice che include l'auto-update:

```javascript
const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    frame: true,
    backgroundColor: '#121212',
    icon: path.join(__dirname, '../public/icon.png'),
    title: 'Spotifly'
  });

  const isDev = !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
    
    // Avvia auto-updater solo in produzione
    autoUpdater.checkForUpdatesAndNotify();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  
  if (!app.isPackaged) {
    console.log('🔧 Running in development mode');
  } else {
    setupAutoUpdater();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Configurazione Auto-Updater
function setupAutoUpdater() {
  autoUpdater.on('checking-for-update', () => {
    console.log('🔍 Controllo aggiornamenti...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('✅ Aggiornamento disponibile:', info.version);
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('ℹ️ Nessun aggiornamento disponibile');
  });

  autoUpdater.on('error', (err) => {
    console.error('❌ Errore auto-updater:', err);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    console.log(`⏬ Download: ${Math.round(progressObj.percent)}%`);
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('✅ Aggiornamento scaricato, verrà installato al riavvio');
  });
}
```

## 🎨 Creazione Icone

### Per Windows (.ico)
Hai bisogno di un file `.ico` con queste dimensioni: 256x256, 128x128, 64x64, 48x48, 32x32, 16x16

Puoi creare l'icona usando:
- Online: https://www.icoconverter.com/
- Tool: ImageMagick o GIMP

Salva come: `public/icon.ico`

### Per macOS (.icns)
Usa uno strumento come:
- Online: https://cloudconvert.com/png-to-icns
- Mac tool: Icon Composer

Salva come: `public/icon.icns`

### Per Linux (.png)
Immagine PNG 512x512 o 1024x1024

Salva come: `public/icon.png`

## 🔨 Build dell'Applicazione

### 1. Build Frontend React
```bash
npm run build
```
Questo crea la cartella `build/` con i file statici

### 2. Build Installer Windows
```bash
npm run package
```

Oppure specificando la piattaforma:
```bash
npx electron-builder --win
```

L'installer verrà creato nella cartella `dist/`

### 3. Build per tutte le piattaforme
```bash
npx electron-builder --win --mac --linux
```

## 📦 Risultato Build

Dopo la build troverai nella cartella `dist/`:

**Windows:**
- `Spotifly Setup 2.0.0.exe` - Installer NSIS

**macOS:**
- `Spotifly-2.0.0.dmg` - Immagine disco

**Linux:**
- `Spotifly-2.0.0.AppImage` - AppImage eseguibile

## 🔄 Sistema di Aggiornamenti Automatici

### Opzione 1: GitHub Releases (Gratuito)
1. Crea repository GitHub per Spotifly
2. Fai push del codice
3. Dopo ogni build, crea una Release su GitHub
4. Carica i file dalla cartella `dist/` come assets della release
5. electron-updater controllerà automaticamente le nuove releases

### Opzione 2: Server Personalizzato
Configura un server che serve i file di aggiornamento con la struttura:
```
https://your-server.com/
  ├── latest.yml (Windows)
  ├── latest-mac.yml (macOS)
  ├── latest-linux.yml (Linux)
  └── releases/
      ├── Spotifly-Setup-2.0.0.exe
      └── ...
```

Modifica `electron/main.js`:
```javascript
autoUpdater.setFeedURL({
  provider: 'generic',
  url: 'https://your-server.com/releases'
});
```

## 📝 Workflow Completo di Release

1. **Incrementa versione** in `package.json`:
   ```json
   "version": "2.0.1"
   ```

2. **Build frontend**:
   ```bash
   npm run build
   ```

3. **Crea installer**:
   ```bash
   npm run package
   ```

4. **Pubblica su GitHub** (se usi GitHub):
   ```bash
   git tag v2.0.1
   git push origin v2.0.1
   ```
   Poi crea Release su GitHub e carica i file da `dist/`

5. **Gli utenti riceveranno automaticamente la notifica** al prossimo avvio

## 🧪 Test Build Locale

Prima di distribuire:
1. Installa l'applicazione dal file creato in `dist/`
2. Verifica che:
   - L'app si avvia correttamente
   - Il database viene creato
   - Upload funziona
   - Player funziona
   - Tutte le funzionalità sono operative

## 🐛 Troubleshooting

### Build fallisce
- Verifica che tutte le dipendenze siano installate: `npm install`
- Elimina `node_modules` e reinstalla: `rm -rf node_modules && npm install`
- Controlla i log di electron-builder

### Icone non appaiono
- Verifica che i file icona esistano nelle posizioni corrette
- Assicurati che i percorsi in `package.json` siano corretti

### Auto-updater non funziona
- Funziona solo in produzione (app impacchettata)
- Verifica configurazione `publish` in package.json
- Controlla console per errori

### App non si connette al server
- Il server deve essere in esecuzione sulla porta 3001
- Per produzione, considera di embeddare il server nell'app o usare un server remoto

## 🌟 Prossimi Passi

1. **Configurare CI/CD**: Automatizza build con GitHub Actions
2. **Firma digitale**: Firma l'app per evitare warning di sicurezza
3. **Server backend remoto**: Deploy backend su Heroku/AWS/Railway
4. **Multi-device sync**: Implementa sincronizzazione cloud
5. **Telemetria**: Aggiungi analytics per uso app

## 📚 Risorse

- [Electron Builder Docs](https://www.electron.build/)
- [electron-updater Docs](https://www.electron.build/auto-update)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)
