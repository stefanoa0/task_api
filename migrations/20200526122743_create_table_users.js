
exports.up = function (knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('name').notNull();
        table.string('email').notNull().unique();
        table.string('password').notNull();
        table.datetime('create_at').notNull();
        table.datetime('delete_at');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
