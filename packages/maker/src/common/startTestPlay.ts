import { ipcRenderer } from "electron";
import { Store } from "../State";

/**
 * テストプレイを行います。
 */
export default function startTestPlay() {
    ipcRenderer.send('testplay', {
        wwaData: Store.getState().wwaData,
        absolutePath: Store.getState().load?.currentFilePath
    });
}
