/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable("tariffs", (table) => {
        table.increments("id").primary();
        table.date("date").notNullable();
        table.string("warehouse_name").notNullable();
        table.string("geo_name");
        table.float("box_delivery_base");
        table.float("box_delivery_liter");
        table.float("box_delivery_coef_expr");
        table.float("box_delivery_marketplace_base");
        table.float("box_delivery_marketplace_liter");
        table.float("box_delivery_marketplace_coef_expr");
        table.float("box_storage_base");
        table.float("box_storage_liter");
        table.float("box_storage_coef_expr");
        table.timestamp("updated_at").defaultTo(knex.fn.now());
        table.unique(["date", "warehouse_name"]);
    });
}
/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("tariffs");
}