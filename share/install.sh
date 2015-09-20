#!/bin/bash

# Vérification des versions
node -v
bower -v
nodemon -v
grunt --version

# Vérification de la présence de l'app
if [ ! -d ~/mondedie-chat ]; then
 echo "No git repository"
 exit 1
fi

cd ~/mondedie-chat

# Installation des dépendances
npm install

# Compilation des assets
grunt run

# Exécution de l'app
node app.js