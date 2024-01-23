# Express.js Auth Backend

## Table of Contents

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Database](#database)
- [API Documentation](#api-documentation)
- [Contact](#contact)

## Introduction

This Express.js application is a demo project built with [TypeORM](https://typeorm.io/) for database management and [routing-controllers](https://github.com/typestack/routing-controllers) for handling routes and controllers.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/gevorgabgaryan/expressjs-auth-backend.git
    cd expressjs-auth-backend
    ```

## Configuration

1. Create a `.env` file based on the provided `env.prod` file:

    ```bash
    cp .env.prod .env
    ```

2. Open the `.env` file in a text editor and fill in the required configuration values. Adjust the values according to your specific setup.

## Usage

### Prod

1. Build and start the application:

    ```bash
    docker-compose up --build
    ```

2. The application will be running on:

    http://localhost:4000

### Dev

#### Running in Dev Mode

1. Start the database and the application:

    ```bash
    docker-compose -f docker-compose.dev.yml up -d
    ```

    Database runs on port 5543.

2. Setup environment:

    ```bash
    cp .env.example .env
    ```

    Adjust the values according to your specific setup.

3. Run `npm run dev` to start nodemon with ts-node, serving the app.

## Database

- Run `npm run db:dev:restart` to drop and re-create all tables (all data will be lost).

## API Documentation

1. API documentation is generated using Swagger UI.
   After starting the application, you can access the documentation at:

    http://localhost:4000/api-docs

## Contact
   For any inquiries, please contact Gevorg
   at gevorg.gak@gmail.com