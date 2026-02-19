import knex from "#postgres/knex.js";

interface Warehouse {
    warehouseName: string;
    geoName: string;
    boxDeliveryBase: string;
    boxDeliveryLiter: string;
    boxDeliveryCoefExpr: string;
    boxDeliveryMarketplaceBase: string;
    boxDeliveryMarketplaceLiter: string;
    boxDeliveryMarketplaceCoefExpr: string;
    boxStorageBase: string;
    boxStorageLiter: string;
    boxStorageCoefExpr: string;
}

export async function upsertTariffs(date: string, warehouseList: Warehouse[]) {
    const rows = warehouseList.map((w) => ({
        date,
        warehouse_name: w.warehouseName,
        geo_name: w.geoName,
        box_delivery_base: parseFloat(w.boxDeliveryBase.replace(",", ".")),
        box_delivery_liter: parseFloat(w.boxDeliveryLiter.replace(",", ".")),
        box_delivery_coef_expr: parseFloat(w.boxDeliveryCoefExpr.replace(",", ".")),
        box_delivery_marketplace_base: parseFloat(w.boxDeliveryMarketplaceBase.replace(",", ".")),
        box_delivery_marketplace_liter: parseFloat(w.boxDeliveryMarketplaceLiter.replace(",", ".")),
        box_delivery_marketplace_coef_expr: parseFloat(w.boxDeliveryMarketplaceCoefExpr.replace(",", ".")),
        box_storage_base: parseFloat(w.boxStorageBase.replace(",", ".")),
        box_storage_liter: parseFloat(w.boxStorageLiter.replace(",", ".")),
        box_storage_coef_expr: parseFloat(w.boxStorageCoefExpr.replace(",", ".")),
        updated_at: new Date(),
    }));

    await knex("tariffs").insert(rows).onConflict(["date", "warehouse_name"]).merge();
}