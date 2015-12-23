FROM xataz/node:5.3.0-onbuild
MAINTAINER "xataz <xataz@mondedie.fr>"
ENV REDIS_URL=redis://localhost:6379
ENV AUTH_API_ENDPOINT=http://domain.tld/api/auth.php
ENV ENV=production
ENV COOKIES_SECRET=xxxxxxxxxxx
ENV SESSION_SECRET=yyyyyyyyyyy

CMD ["npm","start"]
