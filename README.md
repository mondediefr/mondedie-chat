# Mondedie-chat

Node.js chat application using Express, Socket.io, Redis and Mithril.

## Features

- Real-time communication via socket or long-polling
- Using flarum API
- Responsive design
- Private messages
- List of connected users
- Auto-complete usernames, commands and smileys
- Kick/ban
- markdown syntax (with GitHub Flavored Markdown + syntax Highlighting)
- Emoji
- Desktop notifications
- AFK mode
- Poke @user with notification
- Roll dices (+ one special roll)
- User typing hint
- Messages deletion
- Managing network issues
- Work with Chrome, Firefox, IE11/Edge, Opera, Safari
- Smart chatbot (IQ 157)

## Screenshot

![screenshot](https://images.mondedie.fr/p1fy7flP/KlbD6rL5.png "screenshot")

![screenshot responsive](https://images.mondedie.fr/SMdzJAdJ/cJ3wt7lL.png "screenshot responsive")

---

## Authentication method

See Flarum documentation : http://flarum.org/docs/api/

---

## Environment variables

| Variable | Description | Type | Default value |
| -------- | ----------- | ---- | ------------- |
| **ENV** | Environnement | **required** | development
| **PORT** | port app | *optional* | 5000
| **FLARUM_API_ENDPOINT** | Url api flarum | **required** | none
| **COOKIES_SECRET** | set random cookies secret | **required** | none
| **SESSION_SECRET** | set random session secret | **required** | none
| **REDIS_URL** | Redis instance ip/hostname | **required**  | none
| **PIWIK_ID** | Piwik id | *optional* | none
| **PIWIK_URL** | Piwik url | *optional* | none

---

## Manual installation

### Requirements:

* Node.js
* Yarn
* Redis

Clone the project and install dependencies :
```
git clone https://github.com/mondediefr/mondedie-chat.git
cd mondedie-chat

yarn global add bower gulp pm2
yarn install

gulp
```

Create .env file in project root with this content :

```
ENV=production
COOKIES_SECRET=xxxxxxxxxxx
SESSION_SECRET=yyyyyyyyyyy
FLARUM_API_ENDPOINT=http://domain.tld/api/auth
```

Start application :

```
pm2 start --node-args="--harmony" --name mondedie-chat app.js
```

Open app : http://127.0.0.1:5000/

---

## Developement installation

### Requirements:

* heroku toolbelt : https://toolbelt.heroku.com/
* Node.js
* Yarn
* Redis

Clone the project and install dependencies :
```
git clone https://github.com/mondediefr/mondedie-chat.git
cd mondedie-chat

yarn global add -g bower gulp nodemon
yarn install

gulp
```

Create .env file in project root with this content :

```
ENV=development
COOKIES_SECRET=xxxxxxxxxxx
SESSION_SECRET=yyyyyyyyyyy
FLARUM_API_ENDPOINT=http://domain.tld/api/auth
```

Create Procfile_dev file in project root with this content :

```
web: nodemon --delay 1 --exec "node --harmony" app.js
worker: gulp watch
```

Start application :

```
foreman start -f Procfile_dev
```

Open app : http://127.0.0.1:5000/

---

## Docker installation

### Build image
```
docker pull mondedie/mondedie-chat
```

### Image usage

#### Environment variables

* ENV=production
* FLARUM_API_ENDPOINT=http://your-domain.tld/api/auth.php
* COOKIES_SECRET=PLEASE_REPLACE_BY_RANDOM_VALUE
* SESSION_SECRET=PLEASE_REPLACE_BY_RANDOM_VALUE
* REDIS_URL=redis://redis:6379

#### Setup

We have created a [docker-compose.yml](https://github.com/mondediefr/mondedie-chat/blob/master/docker-compose.yml) including 3 containers :

* chat
* redis
* nginx : reverse-proxy mode

Create a new Nginx vhost with this content :

```nginx
# /mnt/docker/nginx/sites-enabled/chat.conf

server {

  listen 8000;
  server_name chat.domain.tld;

  location / {
    proxy_pass http://chat:5000;
    # For websockets handshake to establish the upgraded connection
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }

}
```

Run !

```
docker-compose up -d
```

---

## Development Docker installation

#### Requirements:

* docker
* nodejs
* yarn
* gulp

#### Set environment variables
```bash
sudo echo '127.0.0.1 mondedie-chat.dev' >> /etc/hosts
echo 'export FLARUM_API_ENDPOINT="http://your-domain.tld/api/"' >> ~/.bash_profile
```

#### Setup

```bash
cd /path/to/chat/mondedie-chat
yarn install
docker-compose --file dev.yml up -d
gulp watch
```
Open app : http://mondedie-chat.dev:5000/

---

## Roadmap

- Private rooms
- Unit tests + coverage
- Build an API
- Increase chatbot IQ

## Contribute

- Fork this repository
- Create a new feature branch for a new functionality or bugfix
- Commit your changes
- Push your code and open a new pull request
- Use [issues](https://github.com/mondediefr/mondedie-chat/issues) for any questions

## Support

https://github.com/mondediefr/mondedie-chat/issues

## License

Apache License Version 2.0

## Contact

- [contact@mondedie.fr](mailto:contact@mondedie.fr)
- [https://twitter.com/mondediefr](https://twitter.com/mondediefr)
