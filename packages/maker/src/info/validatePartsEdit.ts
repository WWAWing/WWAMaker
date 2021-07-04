import { ipcRenderer } from "electron";
import { PartsType } from "../classes/WWAData";

/**
 * 指定したパーツ種別とパーツ番号で編集可能かを判別します。
 * Promise で返し、問題がなければ resolve し、問題があれば reject します。
 * @param type パーツ種別
 * @param number パーツ番号
 * @returns 編集の可否を示す Promise
 */
export default function validatePartsEdit(type: PartsType, number: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        if (number === 0) {
            const partsTypeName = {
                [PartsType.OBJECT]: "物体",
                [PartsType.MAP]: "背景"
            }[type];
            ipcRenderer.invoke('message-dialog-warning', {
                message: "パーツ番号 0 の" + partsTypeName + "は編集できません。\n" +
                         "このパーツはマップの" + partsTypeName + "を消去ときに指定してください。"
            }).then((value: Electron.MessageBoxReturnValue) => {
                // TODO: ユーザーの操作間違いで Rejec が発生するのはあまり望ましくないので、別の方法を考える
                reject();
            });
        } else {
            resolve();
        }
    });
}
