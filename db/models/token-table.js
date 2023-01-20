const knex = require('../knexfile');

const a = knex.schema.createTable('Token', (table) => {
    table.integer('userId',10).notNullable();
    table.string('refreshToken', 255).notNullable();

});



a.raw("SELECT VERSION()").then(() => {
    console.log(`Create table successful!`);
});

