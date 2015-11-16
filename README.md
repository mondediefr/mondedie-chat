# Mondedie-chat

Node.js chat application using Express, Socket.io, Redis and Mithril.

[![dependency](https://img.shields.io/david/mondediefr/mondedie-chat.svg?label=Dependencies)](https://github.com/mondediefr/mondedie-chat/blob/master/package.json#L8)
[![release](https://img.shields.io/github/release/mondediefr/mondedie-chat.svg?label=Release)](https://github.com/mondediefr/mondedie-chat/releases)
[![stars](https://img.shields.io/github/stars/mondediefr/mondedie-chat.svg?label=Likes)](https://github.com/mondediefr/mondedie-chat/stargazers)
[![license](https://img.shields.io/github/license/mondediefr/mondedie-chat.svg?label=License)](https://raw.githubusercontent.com/mondediefr/mondedie-chat/master/LICENSE)

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

![screenshot](https://i.imgur.com/5DD0KqC.png "screenshot")
![screenshot responsive](https://i.imgur.com/TuSo0Ha.png "screenshot responsive")

## Hosting

This chat is hosted on Heroku using free dyno with following add-ons :

- Heroku Redis - Free plan
- Logentries - Free plan
- Deploy Hooks

Redis database is hosted on Amazon EC2.

URL : http://chat.mondedie.fr/

### Heroku deployment

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

---

## Authentication method

### Authentication request

The application sends a HTTP POST request to the API endpoint specified in *AUTH_API_ENDPOINT* environment variable.

#### Request body

- **login** (*String*) : Account username
- **password** (*String*) : Account password

#### Request scheme example

`AUTH_API_ENDPOINT=http://domain.tld/api/auth`

```
POST /api/auth HTTP/1.1
Host: domain.tld
Content-type: application/x-www-form-urlencoded

login=username&password=password
```

### Authentication output structure example

Your auth API endpoint **MUST** return this type of json structure :

```json
{
  "data": {
    "id": "4",
    "attributes": {
      "username": "Hardware",
      "avatarUrl": "http://......."
    }
  },
  "included": {
    "attributes": {
      "nameSingular": "Administrator",
      "namePlural": "Administrators",
      "color": "#7cc359"
    }
  }
}
```

With HTTP status code of **200** when user is successfully authenticated or **403** otherwise.

### Properties

- `data.id` : User ID
- `data.attributes.username` : User name
- `data.attributes.avatarUrl` : User avatar URL
- `data.included.attributes.namePlural` : Group name
- `data.included.attributes.color` : Group color

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

### installation

```bash
vagrant up # for installation
vagrant halt # stop vagrant
vagrant up --provision # restart vagrant
```

Open app : `http://mondedie-chat.dev`

---

## Manual installation

### Requirements:

* Node.js
* NPM
* Redis

Clone the project and install dependencies :
```
git clone https://github.com/mondediefr/mondedie-chat.git
cd mondedie-chat

npm install -g bower gulp pm2
npm install

gulp
```

Create .env file in project root with this content :

```
ENV=development
COOKIES_SECRET=xxxxxxxxxxx
SESSION_SECRET=yyyyyyyyyyy
AUTH_API_ENDPOINT=http://domain.tld/api/auth
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
* NPM
* Redis

Clone the project and install dependencies :
```
git clone https://github.com/mondediefr/mondedie-chat.git
cd mondedie-chat

npm install -g bower gulp nodemon
npm install

gulp
```

Create .env file in project root with this content :

```
ENV=development
COOKIES_SECRET=xxxxxxxxxxx
SESSION_SECRET=yyyyyyyyyyy
AUTH_API_ENDPOINT=http://domain.tld/api/auth
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

## Roadmap

- Ignore a user
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
