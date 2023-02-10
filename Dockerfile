FROM node:19.6.0-alpine3.17
MAINTAINER miaowing <me@mxb.cc>

ENV VERSION 2.0.0
ENV NODE_ENV production

WORKDIR /usr/src/app

ADD package.json ./package.json
ADD node_modules ./node_modules
ADD src/ ./src

CMD ["npm","start"]

EXPOSE 3000
