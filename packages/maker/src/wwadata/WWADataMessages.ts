import { ipcRenderer } from "electron";
import { Store } from "../State";

ipcRenderer.on('save-wwadata-request-wwadata', () => {
    ipcRenderer.send('save-wwadata-receive-wwadata', {
        data: Store.getState().wwaData,
        filePath: Store.getState().load?.currentFilePath
    });
});
