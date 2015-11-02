# Mondedie-chat

Node.js chat application for mondedie.fr forum using Express, Socket.io, Redis and Mithril.

[![dependency](https://img.shields.io/david/mondediefr/mondedie-chat.svg?label=Dependencies)](https://github.com/mondediefr/mondedie-chat/blob/master/package.json#L8)
[![release](https://img.shields.io/github/release/mondediefr/mondedie-chat.svg?label=Release)](https://github.com/mondediefr/mondedie-chat/releases)
[![stars](https://img.shields.io/github/stars/mondediefr/mondedie-chat.svg?label=Likes)](https://github.com/mondediefr/mondedie-chat/stargazers)
[![license](https://img.shields.io/github/license/mondediefr/mondedie-chat.svg?label=License)](https://raw.githubusercontent.com/mondediefr/mondedie-chat/master/LICENSE)

## Features

- Real-time communication via socket or long-polling
- Using flarum API
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

![screenshot](https://i.imgur.com/2oeAaIO.png "screenshot")

## Hosting

This chat is hosted on Heroku using free dyno with following add-ons :

- Heroku Redis - Free plan
- Logentries - Free plan
- Deploy Hooks

Redis database is hosted on Amazon EC2.

URL : http://chat.mondedie.fr/

---

## Vagrant installation

### Requirements:

- [chef-dk](https://downloads.chef.io/chef-dk/)
- [virtualbox](https://www.virtualbox.org/wiki/Downloads)
- [vagrant](https://www.vagrantup.com/downloads.html)

### Vagrant plugins :

```
vagrant plugin install vagrant-berkshelf
vagrant plugin install vagrant-hostmanager
```

### Up !

```
vagrant up
```

Open app : `http://mondedie-chat.dev`

---

## Manual installation

### Requirements:

* heroku toolbelt : https://toolbelt.heroku.com/
* Node.js
* NPM
* Redis

Clone the project and install dependencies :
```
git clone https://github.com/mondediefr/mondedie-chat.git
cd mondedie-chat

npm install -g bower
npm install -g gulp
npm install -g nodemon
npm install

gulp
```

Create .env file in project root with this content :

```
ENV=development
APP_URL=http://127.0.0.1:5000/
COOKIES_SECRET=Xpg29n6s9hGuKqWA24U3w5gBAD46yw5X
SESSION_SECRET=4fQ9FMEGqYSw3d289h72zx7S4hytb6BG
FLARUM_API_ENDPOINT=http://flarum.mondedie.fr/api/
FLUXBB_API_ENDPOINT=http://mondedie.fr/api/
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

---

## Roadmap

- Ignore a user
- Responsive design
- Private rooms
- Unit tests + coverage
- Docker container
- Build an API
- Increase chatbot IQ

## Contribute

- First read [CONTRIBUTION.md](https://github.com/mondediefr/mondedie-chat/tree/master/docs/CONTRIBUTION.md)
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