#!/bin/bash

# Vérification de la présence de l'app
if [ ! -d ~/mondedie-chat ]; then
 echo "No git repository"
 exit 1
fi

cd ~/mondedie-chat

# Installation des dépendances
npm --no-bin-links install

# Compilation des assets
gulp

# Exécution de l'app
pm2 start app.js
