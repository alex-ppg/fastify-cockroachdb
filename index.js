"use strict";

const fastifyPlugin = require("fastify-plugin");
const Sequelize = require("sequelize-cockroachdb");

async function cockroachConnector(fastify, options) {
  // CockroachDB is a Postgre SQL Database
  options.settings.dialect = "postgres";
  const sequelize = new Sequelize(
    options.database,
    options.user,
    options.password,
    options.settings
  );

  // Ensure details are correct
  await sequelize.sync();

  const decorator = {
    instance: sequelize
  };

  if (options.models.length !== 0) {
    options.models.forEach(model => {
      decorator[
        model.alias
          ? model.alias
          : `${model.name[0].toUpperCase()}${model.name.slice(1)}`
      ] = sequelize.define(model.name, model.schema);
    });
  }

  fastify.decorate("cockroachdb", decorator);
}

module.exports = fastifyPlugin(cockroachConnector);
