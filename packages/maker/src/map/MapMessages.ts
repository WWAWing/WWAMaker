import { ipcRenderer } from "electron";
import { toggleInfoPanel } from "../info/InfoPanelState";
import { Store } from "../State";
import { toggleGrid } from "./MapStates";

ipcRenderer.on('view-toggle-grid', () => {
    Store.dispatch(toggleGrid());
});

ipcRenderer.on('view-toggle-infopanel', () => {
    Store.dispatch(toggleInfoPanel());
});
