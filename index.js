"use strict";

const fastifyPlugin = require("fastify-plugin");
const Sequelize = require("sequelize-cockroachdb");

async function cockroachConnector(fastify, options) {
  // CockroachDB is a Postgre SQL Database so override custom dialect
  options.settings ? (options.settings.dialect = "postgres") : undefined;
  const sequelize = new Sequelize(
    options.database,
    options.user,
    options.password ? options.password : "",
    options.settings
      ? options.settings
      : {
          dialect: "postgres",
          port: options.port ? options.port : 26257,
          logging: false
        }
  );

  // Ensure details are correct
  await sequelize.sync();

  const decorator = {
    instance: sequelize
  };

  if (options.models.length !== 0) {
    decorator.models = {};
    options.models.forEach(model => {
      decorator.models[
        model.alias
          ? model.alias
          : `${model.name[0].toUpperCase()}${model.name.slice(1)}`
      ] = sequelize.define(model.name, model.schema);
    });
  }

  fastify.decorate("cockroachdb", decorator);
}

module.exports = fastifyPlugin(cockroachConnector);
