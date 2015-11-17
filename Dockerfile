FROM node:onbuild  
MAINTAINER "xataz <xataz@mondedie.fr>"  
ENV REDIS_URL=redis://redis:6379
ENV AUTH_API_ENDPOINT=http://mondedie.fr/api/auth.php
ENV ENV=development
ENV COOKIES_SECRET=cbdjgjfozjshgklh679
ENV SESSION_SECRET=hfdksoehngkfdlshj2
ENV REDIS_URL=redis://redis:6379

RUN npm install -g bower gulp && gulp

CMD ["npm","start"]
