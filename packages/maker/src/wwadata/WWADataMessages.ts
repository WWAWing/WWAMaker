import { ipcRenderer } from "electron";
import { Store } from "../State";

ipcRenderer.on('save-wwadata-request-wwadata', () => {
    ipcRenderer.send('save-wwadata-receive-wwadata', Store.getState().wwaData);
});
