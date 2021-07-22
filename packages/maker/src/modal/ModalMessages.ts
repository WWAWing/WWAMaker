import { ipcRenderer } from "electron";
import { Store } from "../State";
import { openTestPlay } from "./ModalState";

ipcRenderer.on('show-testplay', () => {
    Store.dispatch(openTestPlay());
});
