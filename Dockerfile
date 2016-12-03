FROM xataz/node:7.1-onbuild
MAINTAINER "xataz <xataz@mondedie.fr>"
ENV ENV=production UID=1000 GID=1000
CMD ["npm", "start"]
