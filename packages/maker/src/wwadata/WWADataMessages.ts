import { ipcRenderer } from "electron";
import { Store } from "../State";

ipcRenderer.on('save-wwadata-request-wwadata', () => {
    console.log('received WWAData request.');
    ipcRenderer.send('save-wwadata-receive-wwadata', Store.getState().wwaData);
});
