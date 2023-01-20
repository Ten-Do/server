exports.up = function (knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id');
        table.string('email').unique().notNullable();
        table.string('name').notNullable();
        table.string('surname').notNullable();
        table.string('password').notNullable();
        table.string('img').notNullable();
        table.boolean('activated').defaultTo(false);
        table.string('role').defaultTo('User');
        // далее идут подписки на задачи
        table.boolean('admin').defaultTo(false);
        table.boolean('reverse').defaultTo(false);
        table.boolean('stegano').defaultTo(false);
        table.boolean('ppc').defaultTo(false);
        table.boolean('forensic').defaultTo(false);
        table.boolean('crypto').defaultTo(false);
        table.boolean('web').defaultTo(false);
        table.boolean('network').defaultTo(false);
        table.boolean('osint').defaultTo(false);
    })
    .createTable('tasks', table => {
        table.increments('id');
        table.string('type').notNullable(); // одна из подписок
        table.string('difficulty').notNullable();
        table.smallint('points').unsigned().notNullable();
        table.string('title').notNullable();
        table.text('description');
        table.string('task_file');
        table.string('answer').notNullable(); // то что мы хотим получить от пользователя
        table.string('solution_file').notNullable(); // файл с решением
    })
    .createTable('materials', table => {
        table.increments('id');
        table.string('type').notNullable();
        table.string('title').notNullable();
        table.text('description');
        table.string('additional_data_file');
    })
    .createTable('tokens', table => {
        table.integer('user_id').unsigned().unique().notNullable();
        table.string('refresh_token');
        table.primary('user_id');
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    })
    .createTable('users_tasks', table => {
        table.integer('user_id').unsigned().unique().notNullable();
        table.smallint('task_id').unsigned().unique().notNullable();
        table.boolean('is_solved').defaultTo(null);
        table.primary(['user_id', 'task_id']);
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.foreign('task_id').references('id').inTable('tasks').onDelete('CASCADE');
    })
    .createTable('scores', table => {
        table.integer('user_id').unsigned().unique().notNullable();
        table.integer('admin_score').defaultTo(0);
        table.integer('reverse_score').defaultTo(0);
        table.integer('stegano_score').defaultTo(0);
        table.integer('ppc_score').defaultTo(0);
        table.integer('forensic_score').defaultTo(0);
        table.integer('crypto_score').defaultTo(0);
        table.integer('web_score').defaultTo(0);
        table.integer('network_score').defaultTo(0);
        table.integer('osint_score').defaultTo(0);
        table.primary('user_id');
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    })
};


exports.down = function (knex) {
    return knex.schema
    .dropTable('users')
    .dropTable('tasks')
    .dropTable('tokens')
    .dropTable('materials')
    .dropTable('users_tasks')
    .dropTable('scores')
};

