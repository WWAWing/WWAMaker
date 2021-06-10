import { Store, setMapdata } from "../State";
import { switchInfoPanel } from "../info/InfoPanelState";
import { defaultWWAData } from "../classes/WWAData";

export default function createNewMapdata() {
    // TODO: もしかしたら Electron メインプロセスに移るかもしれない
    Store.dispatch(setMapdata(defaultWWAData));
    Store.dispatch(switchInfoPanel("GENERAL"));
}
