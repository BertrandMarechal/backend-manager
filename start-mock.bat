@echo off
cd front-end
start ng s --open --port 65067
cd ..
cd docker/db-management
start nodemon local-nodemon.json ../../../../ghc/
cd ../..
cd docker/mock-aws
start nodemon nodemon.json ../../../../ghc/
exit 0