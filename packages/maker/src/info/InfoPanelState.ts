import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { PartsType } from "../classes/WWAData";

/**
 * InfoPanel のモードです。
 */
export type InfoPanelMode =
    'GENERAL' | // 基本設定の編集 と システムメッセージの編集
    'PARTS_EDIT'; // パーツ編集

export interface InfoPanelState {
    viewMode: InfoPanelMode,
    partsEdit?: InfoPanelPartsEditState
}

export interface InfoPanelPartsEditState {
    type: PartsType,
    number: number
}

export const INITIAL_STATE: InfoPanelState = {
    viewMode: 'GENERAL'
}

const actionCreator = actionCreatorFactory();
/**
 * InfoPanel で表示する内容を変更します。
 */
export const switchInfoPanel = actionCreator<{ mode: InfoPanelMode }>("SWITCH_INFOPANEL");
/**
 * パーツ編集を表示します。
 */
export const showPartsEdit = actionCreator<InfoPanelPartsEditState>("SHOW_PARTS_EDIT");

export const InfoPanelReducer = reducerWithInitialState(INITIAL_STATE)
    .case(switchInfoPanel, (state, payload) => ({
        ...state,
        viewMode: payload.mode
    }))
    .case(showPartsEdit, (state, payload) => ({
        ...state,
        viewMode: "PARTS_EDIT",
        partsEdit: payload
    }))
