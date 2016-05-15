FROM xataz/node:6.1.0-onbuild
MAINTAINER "xataz <xataz@mondedie.fr>"
ENV ENV=production
CMD ["npm","start"]
