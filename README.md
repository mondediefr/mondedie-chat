# URL Heroku : #

https://mondedie-chat.herokuapp.com/

# Installation de la version de développement en local : #

Installer :

* heroku toolbelt : https://toolbelt.heroku.com/
* Node.js
* NPM

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
COOKIES_SECRET=jdfhqlshfhqhfslhlqsflh
SESSION_SECRET=sqjfhjkhqskfhkhqjkshfj
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