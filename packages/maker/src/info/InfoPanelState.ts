import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { PartsType } from "../classes/WWAData";

/**
 * InfoPanel のモードです。
 */
export type InfoPanelMode =
    'MAP_FOUNDATION' | // 基本設定の編集
    'SYSTEM_MESSAGE' | // システムメッセージの編集
    'PARTS_EDIT'; // パーツ編集

export interface InfoPanelState {
    isOpened: boolean,
    viewMode: InfoPanelMode,
    partsEdit?: InfoPanelPartsEditState
}

export interface InfoPanelPartsEditState {
    type: PartsType,
    number: number
}

export const INITIAL_STATE: InfoPanelState = {
    isOpened: false,
    viewMode: 'MAP_FOUNDATION'
}

const actionCreator = actionCreatorFactory();
/**
 * InfoPanel の表示を切り替えます。
 *     toggle の指定がなければ、今の InfoPanel の表示状態を反転します。
 */
const toggleInfoPanel = actionCreator<{ toggle?: boolean; }>("TOGGLE_INFOPANEL");
/**
 * InfoPanel で表示する内容を変更します。
 */
export const switchInfoPanel = actionCreator<{ mode: InfoPanelMode }>("SWITCH_INFOPANEL");
/**
 * パーツ編集を表示します。
 */
export const showPartsEdit = actionCreator<InfoPanelPartsEditState>("SHOW_PARTS_EDIT");

export const InfoPanelReducer = reducerWithInitialState(INITIAL_STATE)
    .case(toggleInfoPanel, (state, payload) => ({
        ...state,
        isOpened: payload.toggle || !state.isOpened
    }))
    .case(switchInfoPanel, (state, payload) => ({
        ...state,
        viewMode: payload.mode
    }))
    .case(showPartsEdit, (state, payload) => ({
        ...state,
        viewMode: "PARTS_EDIT",
        partsEdit: payload
    }))
