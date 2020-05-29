const config_db = require('../knexfile.js');
const knex = require('knex')(config_db['development']);

knex.migrate.latest([config_db]);

module.exports = knex;