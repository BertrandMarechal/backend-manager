mock-environments

put this folder at the side of your git repo, containing :
- database scripts
- lambda functions (serverless.yml files)

```bat
cls; docker-compose down; docker image rm mock-environments_db-management; docker image rm mock-environments_postgresdb; docker-compose up

cls; docker-compose down; docker image rm mock-environments_postgresdb; docker-compose up
```