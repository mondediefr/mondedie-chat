# URL Heroku : #

https://mondedie-chat.herokuapp.com/

# Installation de la version de développement en local : #

Installer :

* heroku toolbelt : https://toolbelt.heroku.com/
* Node.js
* NPM
* Redis

Cloner le projet et installer les dépendances :
```
heroku git:clone -a mondedie-chat
cd mondedie-chat

npm install -g grunt-cli
npm install -g nodemon
npm install

grunt run
```

Créer un .env à la racine du projet avec ce contenu :

```
ENV=development
APP_URL=http://127.0.0.1:5000/
COOKIES_SECRET=Xpg29n6s9hGuKqWA24U3w5gBAD46yw5X
SESSION_SECRET=4fQ9FMEGqYSw3d289h72zx7S4hytb6BG
FLARUM_API_ENDPOINT=http://flarum.mondedie.fr/api/
FLARUM_URL=http://flarum.mondedie.fr
REDIS_URL=redis://127.0.0.1:6379
```

Créer un fichier Procfile_dev à la racine du projet avec ceci :

```
web: nodemon app.js
worker: grunt
```

Lancer l’application avec :

```
foreman start -f Procfile_dev
```