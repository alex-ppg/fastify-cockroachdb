# Fastify CockroachDB Plugin using Sequelize ORM

[![NPM](https://nodei.co/npm/fastify-cockroachdb.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/fastify-cockroachdb/)
[![CircleCI](https://circleci.com/gh/alex-ppg/fastify-cockroachdb.svg?style=svg)](https://circleci.com/gh/alex-ppg/fastify-cockroachdb)

## Installation

```bash
npm i fastify-cockroachdb -s
```

## Usage

```javascript
// ...Other Plugins
fastify.register(
  require("fastify-cockroachdb"),
  {
    database: "database-name",
    user: "maxroach",
    password: "",
    settings: {
      dialect: "postgres",
      port: 26257,
      logging: false,
      dialectOptions: {
        ssl: {
          ca: fs.readFileSync("certs/ca.crt").toString(),
          key: fs.readFileSync("certs/client.maxroach.key").toString(),
          cert: fs.readFileSync("certs/client.maxroach.crt").toString()
        }
      }
    },
    models: [
      {
        name: "accounts",
        alias: "Account",
        schema: {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true
          },
          balance: {
            type: Sequelize.INTEGER
          }
        }
      }
    ]
  },
  err => {
    if (err) throw err;
  }
);

fastify.get("/", (request, reply) => {
  console.log(fastify.cockroachdb.instance); // Sequelize ORM instance
  console.log(fastify.cockroachdb.models.Account); // Any models declared are available here
});
```

## Options

| Option     | Description                                                                                                                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `database` | Required, the name of the database to connect to within CockroachDB.                                                                                                                                                                                          |
| `user`     | Required, the name of the user to log in as within the database.                                                                                                                                                                                              |
| `password` | Optional, the password of the user to log in as. Should be empty if SSL is used.                                                                                                                                                                              |
| `settings` | Optional, the settings to be passed in to the Sequelize ORM. Should include `dialectOptions` if a secure CockroachDB instance is used. Consult [this tutorial](https://www.cockroachlabs.com/docs/stable/build-a-nodejs-app-with-cockroachdb-sequelize.html). |
| `port`     | Optional, used in place of default port `26257` if no `settings` parameter is found.                                                                                                                                                                          |
| `models`   | Optional, any models to be declared and injected under `fastify.cockroachdb.models`.                                                                                                                                                                          |

Any models declared should follow the following format:

```javascript
{
  name: "profiles", // Required, should match name of model in database
  alias: "Profile", // Optional, an alias to inject the model as
  schema: schemaDefinition // Required, should match schema of model in database
}
```

The `schemaDefinition` variable should be created according to the [Sequelize Model Specification](http://docs.sequelizejs.com/manual/tutorial/models-definition.html).

## Author

[Alex Papageorgiou](alex.ppg@pm.me)

## License

Licensed under [GPLv3](./LICENSE).
