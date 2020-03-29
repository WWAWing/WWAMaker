import { reducerWithInitialState } from "typescript-fsa-reducers";
import { PartsType } from "../classes/WWAData";
import actionCreatorFactory from "typescript-fsa";
import { WWAData } from "@wwawing/common-interface";
import { MapFoundationField } from "../info/MapFoundation";

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
 * パーツを編集します。
 */
export const editParts = actionCreator<{
    type: PartsType,
    number: number,
    attributes: number[],
    message: string
}>("EDIT_PARTS");

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
}

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
    // TODO: 実装する
    .case(editParts, (state, payload) => state)
