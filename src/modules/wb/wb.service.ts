import env from "#config/env/env.js";

const WB_API_URL = "https://common-api.wildberries.ru/api/v1/tariffs/box";

export async function fetchTariffs(date: string) {
    const response = await fetch(`${WB_API_URL}?date=${date}`, {
        headers: {
            Authorization: env.WB_API_TOKEN,
        },
    });

    if (!response.ok) {
        throw new Error(`WB API error: ${response.status}`);
    }

    const json = await response.json();
    return json.response.data;
}