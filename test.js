"use strict";

const fastify = require("fastify")();
const fs = require("fs");
const tap = require("tap");
const Sequelize = require("sequelize-cockroachdb");
const fastifyCockroach = require("./index");

// This test suite recreates https://www.cockroachlabs.com/docs/stable/build-a-nodejs-app-with-cockroachdb-sequelize.html
tap.test("fastify.cockroachdb should exist", test => {
  test.plan(3);

  fastify.register(fastifyCockroach, {
    database: "bank",
    user: "maxroach",
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
  });

  fastify.ready(err => {
    test.error(err);
    test.ok(fastify.cockroachdb.instance);
    test.ok(fastify.cockroachdb.models.Account);

    fastify.close(() => test.end());
  });
});
