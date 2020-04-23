import { reducerWithInitialState } from "typescript-fsa-reducers";
import { PartsType, createEmptyPartsAttribute } from "../classes/WWAData";
import actionCreatorFactory from "typescript-fsa";
import { WWAData } from "@wwawing/common-interface";
import { MapFoundationField } from "../info/MapFoundation";
import WWAConsts from "../classes/WWAConsts";

const actionCreator = actionCreatorFactory();
/**
 * パーツを配置します。
 */
export const putParts = actionCreator<{
    x: number,
    y: number,
    width: number,
    height: number,
    partsType: PartsType,
    partsNumber: number
}>("PUT_PARTS");
/**
 * マップデータの基本設定を設定します。
 */
export const setMapFoundation = actionCreator<MapFoundationField>("SET_MAP_FOUNDATION");
/**
 * システムメッセージを設定します。
 */
export const setSystemMessage = actionCreator<{
    messages: string[]
}>("SET_SYSTEM_MESSAGE");
/**
 * パーツを編集します。
 */
export const editParts = actionCreator<{
    type: PartsType,
    number: number,
    attributes: number[],
    message: string
}>("EDIT_PARTS");
/**
 * パーツを削除します。
 */
export const deleteParts = actionCreator<{
    type: PartsType,
    number: number
}>("DELETE_PARTS");

/**
 * 配列 target から指定した場所に番号を敷き詰めます。
 * @param target 
 * @param value
 * @param x 
 * @param y 
 * @param width 
 * @param height 
 */
const fillParts = (
    target: number[][],
    value: number,
    x: number,
    y: number,
    width: number,
    height: number
): number[][] => {
    return target.map((line, lineIndex) => {
        if (lineIndex < y || lineIndex >= y + height) {
            return line;
        }
        return line.fill(value, x, x + width);
    });
};

/**
 * WWAのデータと追加したいパーツの情報から WWAData.message に指定出来るインデックスを取得します。
 * @param partsType パーツの種類
 * @param partsNumber パーツ番号
 * @param isMessageEmpty 入力したメッセージが空か？ (既存のメッセージ関係なく)
 * @param wwaData 調べたい WWA のデータ
 * @returns 前のメッセージ番号と新しいメッセージ番号を加えた配列
 * @throws 物体パーツでもなく背景パーツでもない場合
 */
const getMessageIndexes = (
    partsType: PartsType,
    partsNumber: number,
    isMessageEmpty: boolean,
    wwaData: WWAData
): [number, number] => {
    const messageIndex =
        partsType === PartsType.MAP ? wwaData.mapAttribute[partsNumber][WWAConsts.ATR_STRING] :
        partsType === PartsType.OBJECT ? wwaData.objectAttribute[partsNumber][WWAConsts.ATR_STRING] :
        null;
    if (messageIndex === null) {
        throw new Error(`異なるパーツ種類 ${partsType} を検出しました。`);
    }

    if (isMessageEmpty) {
        return [messageIndex, 0];
    }

    if (messageIndex === 0) {
        return [0, wwaData.message.length];
    }

    return [messageIndex, messageIndex];
};

export const WWADataReducer = reducerWithInitialState<WWAData | null>(null)
    .case(putParts, (state, payload) => {
        const newState = Object.assign({}, state);
        switch (payload.partsType) {
            case PartsType.MAP:
                newState.map = fillParts(newState.map, payload.partsNumber, payload.x, payload.y, payload.width, payload.height);
                break;
            case PartsType.OBJECT:
                newState.mapObject = fillParts(newState.mapObject, payload.partsNumber, payload.x, payload.y, payload.width, payload.height);
        }
        return newState;
    })
    .case(setMapFoundation, (state, payload) => {
        if (state === null) {
            return null;
        }
        /**
         * @todo このままでは冗長すぎるので、各キーの名前を書かなくてもいいように実装したい
         */
        return {
            ...state,
            worldName: payload.worldName,
            mapCGName: payload.mapCGName,
            playerX: payload.playerX,
            playerY: payload.playerY,
            gameoverX: payload.gameoverX,
            gameoverY: payload.gameoverY,
            statusEnergyMax: payload.statusEnergyMax,
            statusEnergy: payload.statusEnergy,
            statusStrength: payload.statusStrength,
            statusDefence: payload.statusDefence,
            statusGold: payload.statusGold,
            mapWidth: payload.mapWidth
        };
    })
    .case(setSystemMessage, (state, payload) => {
        const newState = Object.assign({}, state);
        newState.systemMessage = payload.messages;

        return newState;
    })
    .case(editParts, (state, payload) => {
        if (state === null) {
            return null;
        }

        const newState = Object.assign({}, state);

        const [oldMessageIndex, newMessageIndex] = getMessageIndexes(payload.type, payload.number, payload.message.length <= 0, state);
        if (oldMessageIndex !== 0 && newMessageIndex === 0) { // メッセージ削除
            newState.message[oldMessageIndex] = "";
        } else if (oldMessageIndex === 0 && newMessageIndex !== 0) { // メッセージ追加
            newState.message.push(payload.message);
        } else if (oldMessageIndex !== 0 && newMessageIndex !== 0) { // メッセージ編集
            newState.message[newMessageIndex] = payload.message;
        }

        /**
         * @todo 後述の getMessageIndexes とパーツ種別検出処理を共通化したい
         */
        if (payload.type === PartsType.MAP) {
            newState.mapAttribute[payload.number] = payload.attributes;
            newState.mapAttribute[payload.number][WWAConsts.ATR_0] = payload.number;
            newState.mapAttribute[payload.number][WWAConsts.ATR_STRING] = newMessageIndex;
        } else if (payload.type === PartsType.OBJECT) {
            newState.objectAttribute[payload.number] = payload.attributes;
            newState.objectAttribute[payload.number][WWAConsts.ATR_0] = payload.number;
            newState.objectAttribute[payload.number][WWAConsts.ATR_STRING] = newMessageIndex;
        }

        return newState;
    })
    .case(deleteParts, (state, payload) => {
        if (state === null) {
            return null;
        }

        const newState = Object.assign({}, state);
        const emptyAttribute = createEmptyPartsAttribute(payload.type);
        switch (payload.type) {
            case PartsType.OBJECT:
                newState.message[state.objectAttribute[payload.number][WWAConsts.ATR_STRING]] = "";
                newState.objectAttribute[payload.number] = emptyAttribute;
                break;
            case PartsType.MAP:
                newState.message[state.mapAttribute[payload.number][WWAConsts.ATR_STRING]] = "";
                newState.mapAttribute[payload.number] = emptyAttribute;
        }

        return newState;
    })
