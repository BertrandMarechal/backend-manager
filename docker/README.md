```bat
cls; docker-compose down; docker image rm mock-environments_db-management mock-environments_postgresdb; docker-compose up

cls; docker-compose down; docker image rm mock-environments_postgresdb; docker-compose up
```