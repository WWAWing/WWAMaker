import { PartsType, createEmptyPartsAttribute } from "../classes/WWAData";
import { WWAData } from "@wwawing/common-interface";
import { MapFoundationField } from "../info/MapFoundation";
import WWAConsts from "../classes/WWAConsts";
import fillParts from "./fillParts";
import editPartsAttribute, { EditPartsParams } from "./editPartsAttribute";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * パーツを配置します。
 */
interface PutPartsParams {
    x: number,
    y: number,
    width: number,
    height: number,
    partsType: PartsType,
    partsNumber: number
}

/**
 * パーツを削除します。
 */
interface DeletePartsParams {
    type: PartsType,
    number: number
}

type WWADataStateType = WWAData | null;

const wwaDataSlice = createSlice({
    name: 'wwadata',
    initialState: null as WWADataStateType,
    reducers: {
        /**
         * マップデータの情報を設定します。
         */
        setMapdata(state, action: PayloadAction<WWAData>) {
            return action.payload;
        },
        /**
         * マップデータの情報を消去し、マップデータを閉じたことにします。
         */
        closeMapdata(state) {
            state = null;
        },
        putParts(state, action: PayloadAction<PutPartsParams>) {
            if (state === null) {
                return;
            }
            const { payload } = action;
            switch (action.payload.partsType) {
                case PartsType.MAP:
                    state.map = fillParts(state.map, payload.partsNumber, payload.x, payload.y, payload.width, payload.height);
                    break;
                case PartsType.OBJECT:
                    state.mapObject = fillParts(state.mapObject, payload.partsNumber, payload.x, payload.y, payload.width, payload.height);
            }
        },
        setMapFoundation(state, action: PayloadAction<MapFoundationField>) {
            if (state === null) {
                return;
            }
            return {
                ...state,
                ...action.payload
            };
        },
        setSystemMessage(state, action: PayloadAction<string[]>) {
            if (state === null) {
                return;
            }
            state.systemMessage = action.payload;
        },
        editParts(state, action: PayloadAction<EditPartsParams>) {
            if (state === null) {
                return;
            }

            const { payload } = action;
            const [newAttribute, messageEditResult] = editPartsAttribute(
                payload.attributes,
                payload.message.length <= 0,
                payload.number,
                state.messageNum - 1
            );

            switch (payload.type) {
                case PartsType.OBJECT:
                    state.objectAttribute[payload.number] = newAttribute;
                    break;
                case PartsType.MAP:
                    state.mapAttribute[payload.number] = newAttribute;
                    break;
                default:
                    throw new Error(`不明なパーツ種類 ${payload.type} を検出しました。`);
            }

            switch (messageEditResult) {
                case "ADD":
                    state.message.push(payload.message);
                    state.messageNum = state.message.length;
                    break;
                case "EDIT":
                    state.message[newAttribute[WWAConsts.ATR_STRING]] = payload.message;
                    break;
                case "REMOVE":
                    // メッセージ削除の際は、削除した場所以降のメッセージのインデックスを変えなくても済むように、領域は残します。
                    // 空になったメッセージは保存時には cleaner で領域ごと削除されます。
                    state.message[newAttribute[WWAConsts.ATR_STRING]] = "";
            }
        },
        deleteParts(state, action: PayloadAction<DeletePartsParams>) {
            if (state === null) {
                return null;
            }

            const { payload } = action;
            const emptyAttribute = createEmptyPartsAttribute(payload.type);
            switch (payload.type) {
                case PartsType.OBJECT:
                    state.message[state.objectAttribute[payload.number][WWAConsts.ATR_STRING]] = "";
                    state.objectAttribute[payload.number] = emptyAttribute;
                    break;
                case PartsType.MAP:
                    state.message[state.mapAttribute[payload.number][WWAConsts.ATR_STRING]] = "";
                    state.mapAttribute[payload.number] = emptyAttribute;
            }
        }
    }
})

export const { setMapdata, closeMapdata, putParts, setMapFoundation, setSystemMessage, editParts, deleteParts } = wwaDataSlice.actions;

export const wwaDataReducer = wwaDataSlice.reducer;
