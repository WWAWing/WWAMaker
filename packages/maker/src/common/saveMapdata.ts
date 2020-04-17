import { Store } from "../State";
import saver from "wwamaker-saver";

export default function saveMapdata() {
    const state = Store.getState();
    if (state.wwaData === null) {
        return;
    }

    console.log(state.wwaData);
    saver(state.wwaData).then(data => {
        const blob = new Blob([data], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);

        const aElement = document.createElement("a");
        aElement.href = url;
        aElement.click();
    });
}
