# 🚀 Setup GitHub per Spotifly - Guida Passo-Passo

## 📋 Prerequisiti

- Account GitHub (crea gratuitamente su https://github.com/signup)
- Git installato (scarica da https://git-scm.com/downloads)

## 🎯 Passi da Seguire

### 1️⃣ Crea Repository su GitHub (2 minuti)

1. Vai su https://github.com/new
2. **Repository name**: `spotifly`
3. **Description**: `🎵 Desktop music streaming app like Spotify - Built with Electron + React`
4. **Visibility**: ✅ **Public** (IMPORTANTE per auto-update gratuito)
5. ❌ NON selezionare "Add README" o ".gitignore" (li abbiamo già)
6. Click **"Create repository"**

### 2️⃣ Configura il Tuo Username nel Package.json (1 minuto)

Apri `package.json` e trova la riga 112:

```json
"owner": "YOUR_GITHUB_USERNAME",
```

Sostituisci con il tuo vero username GitHub. Esempio:
```json
"owner": "mario_rossi",
```

Salva il file.

### 3️⃣ Inizializza Git Locale (2 minuti)

Apri **PowerShell** o **Git Bash** nella cartella del progetto:

```bash
cd "c:\Users\User\Desktop\Spotifly 2.0"
```

Esegui questi comandi:

```bash
# Inizializza repository
git init

# Aggiungi tutti i file
git add .

# Primo commit
git commit -m "Initial commit - Spotifly 2.0"

# Rinomina branch in main
git branch -M main
```

### 4️⃣ Collega a GitHub (1 minuto)

**IMPORTANTE**: Sostituisci `YOUR_USERNAME` con il tuo username GitHub!

```bash
git remote add origin https://github.com/YOUR_USERNAME/spotifly.git

# Esempio:
# git remote add origin https://github.com/mario_rossi/spotifly.git
```

### 5️⃣ Push su GitHub (1 minuto)

```bash
git push -u origin main
```

Se richiede login:
- **Username**: Il tuo username GitHub
- **Password**: Usa un **Personal Access Token** (non la password)

#### Come creare Personal Access Token:
1. Vai su https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Nome: `Spotifly`
4. Seleziona scope: `repo` (tutti)
5. Click "Generate token"
6. **COPIA IL TOKEN** (lo vedrai solo una volta!)
7. Usalo come password quando Git lo chiede

### 6️⃣ Verifica GitHub (30 secondi)

1. Vai su `https://github.com/YOUR_USERNAME/spotifly`
2. Dovresti vedere tutti i file caricati! ✅

### 7️⃣ Crea Prima Release (3 minuti)

Ora creiamo la prima release che attiverà GitHub Actions:

```bash
# Crea tag versione
git tag v2.0.0

# Push del tag
git push origin v2.0.0
```

### 8️⃣ GitHub Actions Inizia Automaticamente! 🎉

1. Vai su `https://github.com/YOUR_USERNAME/spotifly/actions`
2. Vedrai il workflow "Build/release" in esecuzione
3. Aspetta circa **5-10 minuti**
4. GitHub compilerà automaticamente per **Windows, Mac e Linux**!

### 9️⃣ Scarica l'Installer (dopo che Actions finisce)

1. Vai su `https://github.com/YOUR_USERNAME/spotifly/releases`
2. Troverai la release **v2.0.0**
3. Nella sezione **Assets** scarica:
   - `Spotifly-Setup-2.0.0.exe` per Windows
   - `Spotifly-2.0.0.dmg` per Mac
   - `Spotifly-2.0.0.AppImage` per Linux

### 🔟 Installa e Testa! (2 minuti)

1. Scarica `Spotifly-Setup-2.0.0.exe`
2. Esegui l'installer
3. Avvia Spotifly
4. Testa tutte le funzioni:
   - ✅ Login/Register
   - ✅ Upload brani
   - ✅ Player
   - ✅ Playlist
   - ✅ Favorites
   - ✅ Queue
   - ✅ Settings

## 🔄 Workflow Futuri Aggiornamenti

### Quando aggiungi nuove funzionalità:

1. **Modifica il codice localmente**
2. **Incrementa versione** in `package.json`:
   ```json
   "version": "2.1.0"
   ```
3. **Commit e push**:
   ```bash
   git add .
   git commit -m "Add new feature: ..."
   git push origin main
   ```
4. **Crea nuovo tag**:
   ```bash
   git tag v2.1.0
   git push origin v2.1.0
   ```
5. **GitHub Actions compila automaticamente!**
6. **Nuova release appare automaticamente**
7. **Gli utenti ricevono l'aggiornamento automaticamente!** ✨

## 🎨 Prossimi Passi Opzionali

### Crea Icone Professionali

1. Vai su https://www.icoconverter.com/
2. Carica un logo 512x512 px
3. Scarica come `.ico`, `.icns`, `.png`
4. Metti in `public/icon.ico`, `public/icon.icns`, `public/icon.png`
5. Commit e push:
   ```bash
   git add public/
   git commit -m "Add app icons"
   git push origin main
   ```

### Aggiungi README con Screenshot

Crea un bel README con screenshot dell'app per attrarre utenti!

### Abilita GitHub Pages

Crea una landing page per Spotifly su GitHub Pages.

## ❓ Troubleshooting

### Git non è riconosciuto
Installa Git da: https://git-scm.com/downloads

### Push richiede password
Usa Personal Access Token invece della password (vedi passo 5)

### GitHub Actions fallisce
1. Vai su Actions → Click sul workflow fallito
2. Leggi i log
3. Di solito è un problema di configurazione package.json

### Non vedo la release
Aspetta che GitHub Actions finisca (circa 10 minuti). Controlla:
- Actions → Il workflow deve essere verde ✅
- Releases → Apparirà automaticamente

## 📊 Monitoraggio

### Dopo la release, puoi vedere:
- **Downloads**: Quante persone scaricano l'app
- **Stars**: Chi apprezza il progetto
- **Issues**: Bug report degli utenti
- **Traffic**: Visite al repository

## 🎯 Checklist Finale

- [ ] Repository GitHub creato
- [ ] Username aggiornato in package.json
- [ ] Git inizializzato localmente
- [ ] Codice pushato su GitHub
- [ ] Tag v2.0.0 creato e pushato
- [ ] GitHub Actions completato con successo
- [ ] Release v2.0.0 disponibile
- [ ] Installer scaricato e testato
- [ ] Auto-update funzionante

## 🎉 Congratulazioni!

Hai ora:
- ✅ App desktop professionale
- ✅ Build automatizzata su GitHub
- ✅ Distribuzione pubblica
- ✅ Sistema auto-update
- ✅ Multi-piattaforma (Windows, Mac, Linux)

**Spotifly è live! 🎵**

---

**Need Help?** 
- GitHub Docs: https://docs.github.com/
- Electron Builder: https://www.electron.build/
- Spotifly Issues: https://github.com/YOUR_USERNAME/spotifly/issues

**Made with ❤️ for music lovers**
