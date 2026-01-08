#!/bin/bash

echo "==============================================="
echo "  SPOTIFLY 2.0 - Music Streaming App"
echo "==============================================="
echo ""
echo "Avvio del server backend e dell'applicazione..."
echo ""

# Avvia il server in background
npm run server &

# Aspetta 3 secondi
sleep 3

# Avvia Vite in background
npm run dev &

# Aspetta 5 secondi
sleep 5

# Avvia Electron
npm run electron
