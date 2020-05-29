
exports.up = function(knex) {
    return knex.schema.createTable('tasks', table => {
        table.increments('id').primary();
        table.string('description').notNull();
        table.datetime('estimate_date').notNull();
        table.datetime('done_date');
        table.datetime('create_at').notNull();
        table.datetime('delete_at');
        table.integer('user_id').references('id').inTable('users').notNull();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('tasks');
};
