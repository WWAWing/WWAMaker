import { Store, setMapdata } from "../State";
import { switchInfoPanel } from "../info/InfoPanelState";
import { defaultWWAData } from "../classes/WWAData";

export default function createNewMapdata() {
    Store.dispatch(setMapdata({
        wwaData: defaultWWAData
    }));
    Store.dispatch(switchInfoPanel({
        mode: "GENERAL"
    }));
}
