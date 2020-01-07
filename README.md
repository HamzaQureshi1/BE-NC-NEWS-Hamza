BE-NC-NEWS-hamza
Northcoders News API

This project is a RESTful Application Programming Interface (API) that utilises http methodologies in order to retrieve, edit, add or delete articles, topics, comments and users from a generated news based database.
Getting Started

Follow these instructions in order to get a copy of the project up and running on your local machine for development and testing purposes.
Prerequisites

In order to install and run this software locally, you will require node.js.

Installing

1.Clone the repo to a directory of your choosing using: git clone https://github.com/HamzaQureshi1/BE-NC-NEWS-hamza.git

2.CD into the directory and launch in your chosen code editor.

3.Install the dependencies that are required for this API using npm install

Database

1. You will now need to seed the database using this command : npm run seed-development

2.Create a knexfile and insert the following code:

```const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  production: {
    connection: `${DB_URL}?ssl=true`,
  },
  development: {
    connection: {
      database: "nc_news",
        // username:  ,
      // password:
    }
  },
  test: {
    connection: {
      database: "nc_news_test"
       // username: ,
      // password:
    }
  }
};


module.exports = { ...customConfig[ENV], ...baseConfig };
```

If you are using linux you will need to include psql username and password

Running tests

1. You can run tests using the command npm run test-app

Built With:

    Express
    Knex
    PG
    Supertest
    Mocha
    Chai
