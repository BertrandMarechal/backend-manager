FROM node:8.11-alpine

RUN mkdir -p /usr/src/app \
    && apk update \
    && apk upgrade

WORKDIR /usr/src/app

RUN npm install -g typescript

RUN npm install -g ts-node

WORKDIR /usr/src/app

COPY app /usr/src/app

RUN npm install

CMD ["/bin/bash"]

EXPOSE 65065

ENTRYPOINT ts-node main.ts
