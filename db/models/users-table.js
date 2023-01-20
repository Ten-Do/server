
const knex = require('../knexfile');


const a = knex.schema.createTable('users', (table) => {
        table.increments('id');
        table.string('name', 255).notNullable();
        table.string('email', 255).notNullable();
        table.string('password', 255).notNullable();
        table.string('img', 63).defaultTo(null);
        table.boolean('activated').defaultTo(false);
        table.string('refreshToken', 255);
        table.string('role', 31).defaultTo('User');
        table.boolean('admin').defaultTo(false);
        table.boolean('reverse').defaultTo(false);
        table.boolean('stegano').defaultTo(false);
        table.boolean('ppc').defaultTo(false);
        table.boolean('forensic').defaultTo(false);
        table.boolean('crypto').defaultTo(false);
        table.boolean('web').defaultTo(false);
        table.boolean('network').defaultTo(false);
        table.boolean('osint').defaultTo(false);
});



a.raw("SELECT VERSION()").then(() => {
        console.log(`Create table successful!`);
});



