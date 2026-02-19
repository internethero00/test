import cron from "node-cron";
import { fetchTariffs } from "./modules/wb/wb.service.js";
import { upsertTariffs } from "./modules/wb/wb.repository.js";
import { updateAllSheets } from "./modules/sheets/sheets.service.js";

async function job() {
    try {
        const today = new Date().toISOString().split("T")[0]; // "2026-02-19"
        console.log(`[${new Date().toISOString()}] Fetching tariffs...`);

        const data = await fetchTariffs(today);
        await upsertTariffs(today, data.warehouseList);
        console.log(`Saved ${data.warehouseList.length} tariffs to DB`);

        await updateAllSheets();
        console.log(`Google Sheets updated`);
    } catch (error) {
        console.error("Job failed:", error);
    }
}

export function startScheduler() {
    cron.schedule("0 * * * *", job);
    console.log("Scheduler started");

    job();
}