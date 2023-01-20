const knex = require('knex')
const knexfile = require('./knexfile')

const db = knex(knexfile);

db.raw("SELECT VERSION()").then(() => {
    console.log(`Connection to db successful!`);
});

module.exports = db;