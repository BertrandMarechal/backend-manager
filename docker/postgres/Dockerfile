FROM postgres:10-alpine

RUN mkdir -p /docker-entrypoint-initdb.d

RUN mkdir -p /usr/src/app \
    && apk update \
    && apk upgrade

COPY ./scripts /docker-entrypoint-initdb.d

WORKDIR /

EXPOSE 5432