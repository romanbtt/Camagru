import API from "./API.js";

export async function loadStickers() {
    const { ok, data } = await API.fetchStickers();

    if (ok) {
        console.log(data)
        app.store.stickers = data;
    }
    console.log(app.store.stickers)
}