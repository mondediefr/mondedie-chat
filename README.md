# URL Heroku : #

https://mondedie-chat.herokuapp.com/

# Installation avec Vagrant #

## Prérequis:

- [chef-dk](https://downloads.chef.io/chef-dk/)
- [virtualbox](https://www.virtualbox.org/wiki/Downloads)
- [vagrant](https://www.vagrantup.com/downloads.html)

### Vagrant plugins :

```
vagrant plugin install vagrant-berkshelf
```

## Up !

```
vagrant up
```

Ouvrir l'app `http://127.0.0.1:5000`

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