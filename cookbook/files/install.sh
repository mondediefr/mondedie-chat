#!/bin/bash

# Vérification de la présence de l'app
if [ ! -d ~/mondedie-chat ]; then
  echo "No git repository"
  exit 1
fi

# Installation des dépendances et compilation des assets
cd ~/mondedie-chat
npm install
gulp

# Exécution de l'app
pm2 start app.js
