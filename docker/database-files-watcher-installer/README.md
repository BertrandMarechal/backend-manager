# Database files watcher / installer

The aim of this component is to validate the scripts for the database that have been selected on every file change.

## What does it do

It will :

- Start a nodemon server that will listen to cahnges on .sql and .json files in particular folders
- Identify the current version (called "current")
- Get the latest version and its creation script
- On file change, it will :
  - Run the previous version creation script on every file change
  - Run the current version installation scripts
  - Save in a local database the result of the installation
