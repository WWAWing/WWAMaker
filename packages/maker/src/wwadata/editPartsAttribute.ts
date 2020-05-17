import { PartsType } from "../classes/WWAData";
import WWAConsts from "../classes/WWAConsts";

export interface EditPartsParams {
    type: PartsType;
    number: number;
    attributes: number[];
    message: string;
}

export type MessageEditResult = "ADD" | "EDIT" | "REMOVE";

/**
 * パーツ属性を編集します。
 * @param partsAttribute 編集したいパーツ属性
 * @param isMessageEmpty 編集しているメッセージが空か？
 * @param partsNumber パーツ番号
 * @param lastMessageIndex 最後のメッセージのインデックス
 * @returns パーツ種別とメッセージの追加判定
 */
export default function editPartsAttribute(
    partsAttribute: number[],
    isMessageEmpty: boolean,
    partsNumber: number,
    lastMessageIndex: number
): [number[], MessageEditResult] {

    const newAttribute = partsAttribute.slice();
    const messageEditResult = getMessageEditResult(partsAttribute, isMessageEmpty);

    newAttribute[WWAConsts.ATR_0] = partsNumber;
    switch (messageEditResult) {
        case "ADD":
            newAttribute[WWAConsts.ATR_STRING] = lastMessageIndex + 1;
            break;
        case "REMOVE":
            newAttribute[WWAConsts.ATR_STRING] = 0;
    }

    return [newAttribute, messageEditResult];
}


/**
 * 現在のメッセージの状況からメッセージの編集すべき結果を返します。
 * @param attribute パーツの属性
 * @param isMessageEmpty 入力したメッセージが空か？ (既存のメッセージ関係なく)
 * @returns 下記のいずれかの文字列
 *     ADD(追加), EDIT(編集), REMOVE(削除)
 */
const getMessageEditResult = (
    attribute: number[],
    isMessageEmpty: boolean,
): MessageEditResult => {
    const messageIndex = attribute[WWAConsts.ATR_STRING];

    if (messageIndex !== 0 && isMessageEmpty) {
        return "REMOVE";
    }

    if (messageIndex === 0) {
        return "ADD";
    }

    return "EDIT";
};
