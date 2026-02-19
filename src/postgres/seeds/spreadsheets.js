/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    await knex("spreadsheets")
        .insert([{ spreadsheet_id: "13WwpjtCOKRn7ustxRP9vdQEAY03cMAFJ8_Y-ATRcMNI" }])
        .onConflict(["spreadsheet_id"])
        .ignore();
}
