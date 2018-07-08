FROM node:8.11-alpine

RUN mkdir -p /usr/src/app \
    && apk update \
    && apk upgrade

RUN npm install -g typescript

RUN npm install -g ts-node

RUN npm install -g nodemon

WORKDIR /usr/src/app

# we remove the copy option and get ready for it once it's done
# COPY . /usr/src/app
VOLUME /usr/src/app

RUN npm install

CMD ["/bin/bash"]

EXPOSE 8080

ENTRYPOINT nodemon

VOLUME /usr/src/repos
