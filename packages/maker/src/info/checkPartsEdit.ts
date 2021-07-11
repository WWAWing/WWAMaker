import { ipcRenderer } from "electron";
import { PartsType } from "../classes/WWAData";

/**
 * パーツ編集画面を表示します。
 * 編集できないパーツである場合は、実行がキャンセルされます。
 * @param type パーツ種別
 * @param number パーツ番号
 * @param successFunc 編集可能な場合に実行されるメソッド
 */
export default function checkPartsEdit(type: PartsType, number: number, successFunc: () => void) {
    if (number === 0) {
        const partsTypeName = {
            [PartsType.OBJECT]: "物体",
            [PartsType.MAP]: "背景"
        }[type];
        ipcRenderer.invoke('message-dialog-warning', {
            message: "パーツ番号 0 の" + partsTypeName + "は編集できません。\n" +
                        "このパーツはマップの" + partsTypeName + "を消去ときに指定してください。"
        }).then((value: Electron.MessageBoxReturnValue) => {
        });
        return;
    }

    successFunc();
}
