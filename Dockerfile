FROM xataz/node:6.1.0-onbuild
MAINTAINER "xataz <xataz@mondedie.fr>"
ENV ENV=production

RUN chown -R 1000:1000 /usr/src/app
CMD ["gosu", "1000:1000", "npm", "start"]
