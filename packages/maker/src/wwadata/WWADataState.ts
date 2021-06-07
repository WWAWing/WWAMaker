import { PartsType, createEmptyPartsAttribute } from "../classes/WWAData";
import { WWAData } from "@wwawing/common-interface";
import { MapFoundationField } from "../info/MapFoundation";
import WWAConsts from "../classes/WWAConsts";
import fillParts from "./fillParts";
import editPartsAttribute, { EditPartsParams } from "./editPartsAttribute";
import { createAction, createReducer } from "@reduxjs/toolkit";

/**
 * パーツを配置します。
 */
export const putParts = createAction<{
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
export const setMapFoundation = createAction<MapFoundationField>("SET_MAP_FOUNDATION");
/**
 * システムメッセージを設定します。
 */
export const setSystemMessage = createAction<{
    messages: string[]
}>("SET_SYSTEM_MESSAGE");
/**
 * パーツを編集します。
 */
export const editParts = createAction<EditPartsParams>("EDIT_PARTS");
/**
 * パーツを削除します。
 */
export const deleteParts = createAction<{
    type: PartsType,
    number: number
}>("DELETE_PARTS");


export const WWADataReducer = createReducer<WWAData | null>(null, builder => {
    builder
        .addCase(putParts, (state, { payload }) => {
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
        .addCase(setMapFoundation, (state, { payload }) => {
            if (state === null) {
                return null;
            }
            return {
                ...state,
                ...payload
            };
        })
        .addCase(setSystemMessage, (state, { payload }) => {
            const newState = Object.assign({}, state);
            newState.systemMessage = payload.messages;

            return newState;
        })
        .addCase(editParts, (state, { payload }) => {
            if (state === null) {
                return null;
            }

            const newState = Object.assign({}, state);
            const [newAttribute, messageEditResult] = editPartsAttribute(
                payload.attributes,
                payload.message.length > 0,
                payload.number,
                newState.messageNum - 1
            );

            switch (payload.type) {
                case PartsType.OBJECT:
                    newState.objectAttribute[payload.number] = newAttribute;
                    break;
                case PartsType.MAP:
                    newState.mapAttribute[payload.number] = newAttribute;
                    break;
                default:
                    throw new Error(`不明なパーツ種類 ${payload.type} を検出しました。`);
            }

            switch (messageEditResult) {
                case "ADD":
                    newState.message.push(payload.message);
                    newState.messageNum = newState.message.length;
                    break;
                case "EDIT":
                    newState.message[newAttribute[WWAConsts.ATR_STRING]] = payload.message;
                    break;
                case "REMOVE":
                    // メッセージ削除の際は、削除した場所以降のメッセージのインデックスを変えなくても済むように、領域は残します。
                    // 空になったメッセージは保存時には cleaner で領域ごと削除されます。
                    newState.message[newAttribute[WWAConsts.ATR_STRING]] = "";
            }

            return newState;
        })
        .addCase(deleteParts, (state, { payload }) => {
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
});
