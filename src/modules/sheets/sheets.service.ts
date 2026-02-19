import { google } from "googleapis";
import env from "#config/env/env.js";
import knex from "#postgres/knex.js";

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function updateAllSheets() {
    const spreadsheets = await knex("spreadsheets").select("spreadsheet_id");

    const tariffs = await knex("tariffs").whereRaw("date = CURRENT_DATE").orderBy("box_delivery_coef_expr", "asc").select();

    if (tariffs.length === 0) return;

    const headers = [
        "Дата",
        "Склад",
        "Регион",
        "Доставка база",
        "Доставка литр",
        "Коэф доставки",
        "Маркетплейс база",
        "Маркетплейс литр",
        "Коэф маркетплейс",
        "Хранение база",
        "Хранение литр",
        "Коэф хранения",
    ];

    const rows = tariffs.map((t) => [
        t.date,
        t.warehouse_name,
        t.geo_name,
        t.box_delivery_base,
        t.box_delivery_liter,
        t.box_delivery_coef_expr,
        t.box_delivery_marketplace_base,
        t.box_delivery_marketplace_liter,
        t.box_delivery_marketplace_coef_expr,
        t.box_storage_base,
        t.box_storage_liter,
        t.box_storage_coef_expr,
    ]);

    const values = [headers, ...rows];

    for (const { spreadsheet_id } of spreadsheets) {
        await sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheet_id,
            range: "stocks_coefs!A1",
            valueInputOption: "RAW",
            requestBody: { values },
        });
    }
}