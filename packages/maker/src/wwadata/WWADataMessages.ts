import { ipcRenderer } from "electron";
import { defaultWWAData } from "../classes/WWAData";
import startTestPlay from "../common/startTestPlay";
import { switchInfoPanel } from "../info/InfoPanelState";
import { Store } from "../State";
import { setMapdata } from "./WWADataState";

ipcRenderer.on('new-wwadata-process', () => {
    Store.dispatch(setMapdata(defaultWWAData));
    Store.dispatch(switchInfoPanel("GENERAL"));
    ipcRenderer.send('new-wwadata-complete');
});

ipcRenderer.on('save-wwadata-request-wwadata', () => {
    ipcRenderer.send('save-wwadata-receive-wwadata', {
        data: Store.getState().wwaData,
        filePath: Store.getState().load?.currentFilePath
    });
});

ipcRenderer.on('testplay-request-data', () => {
    startTestPlay();
});
