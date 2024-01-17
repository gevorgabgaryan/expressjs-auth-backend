# Express js auth backend

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Contact](#contact)

## Introduction

This Express.js application is a demo project built with [TypeORM](https://typeorm.io/) for database management, [routing-controllers](https://github.com/typestack/routing-controllers) for handling routes and controllers.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation

1. Clone the repository:

    - git clone https://github.com/gevorgabgaryan/expressjs-auth-backend.git
    - cd expressjs-auth-backend

## Configuration

 1. Create a .env file based on the provided env.prod file:

    - cp .env.prod .env

 2. Open the .env file in a text editor and fill
    in the required configuration values,
     Adjust the values according to your specific setup.

## Usage
  1.  Build and start the application
      -  docker-compose up --build

  2. The application will be running on
      -  http://localhost:4000

## Contact
   For any inquiries, please contact Gevorg
   at gevorg.gak@gmail.com