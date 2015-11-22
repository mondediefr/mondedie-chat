FROM xataz/node:onbuild  
MAINTAINER "xataz <xataz@mondedie.fr>"  
ENV REDIS_URL=redis://localhost:6379
ENV AUTH_API_ENDPOINT=http://localhost/api/auth.php
ENV ENV=production
ENV COOKIES_SECRET=cbdjgjfozjshgklh679
ENV SESSION_SECRET=hfdksoehngkfdlshj2

CMD ["npm","start"]
