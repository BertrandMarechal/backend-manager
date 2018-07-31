# mock-environments

This project aims at helping a collection of projects to be set up and maintained for a set up as follow :

- AWS Lambda functions
- PostgreSQL database

## Work in progress

This project is obviously a personal one, developped on my own time, that I try to keep up to date and maintained.

I have a huge ToDo list, and will maintain the high level items in the ToDo section of this page.

## Setup

In order for this project to work, the set up should be as follow :

- All repositories should have an identifiable suffix (set up as "database" for databases, "middle-tier" for middle tiers projects). The suffixes can be changed using the [local management website](http://localhost:690/management) once this one has been launched.
- This git repository should sit on the side of those folders

If you are using this project with an existing project, please make sure the Middle tier and Database repositories are set up as follow.
If you are using this project to create a new application, user the [local management website](http://localhost:690/management) to help you in the set up

### Middle tier

- The middle tier should be set up as follow :
- We are using the serverless framework for this approach, meaning that the services will be stored in serverless.yml files.
- There can be more than one service (serverless.yml) per folder, they just have to have a unique service name
- The middle tier variables should be contained in a variables.yml file, and referred to through references in the serverless.yml file

## Database

The database should be set up as follow :

- The git databases repository is expected to contain :
  - A postgres folder, containing :
    - A release folder containing one folder per version (called x.y.z.a), containing a version.json file that we will talk about later
    - A schema folder, containing the schema definition for the database, and the context data scripts necessary for the application to run

## ToDos

### Global

- [x] Repositories discovery (read the repositories and store the data in a local database)
- [x] Management website initialization
- [x] Variable / setting edit

### Databases

- [x] Database installation
- [ ] Database creation script generation
- [ ] Database upgrade script generation
- [ ] Automatic installation of the current selected version on file change

### Middletier

- [x] Discover services

### Extra

- [ ] Mocking AWS services
  - [ ] Mock KMS
  - [x] Mock Lambda
  - [ ] Mock S3
  - [ ] Mock Cognito
    - [ ] Mock User Pools
    - [ ] Mock Identity Pools