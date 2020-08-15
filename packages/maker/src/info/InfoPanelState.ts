import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";
import { PartsType } from "../classes/WWAData";
import { showError } from "../modal/ModalStates";

/**
 * InfoPanel のモードです。
 */
export type InfoPanelMode =
    'GENERAL' | // 基本設定の編集 と システムメッセージの編集
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
    isOpened: true, // 始めて利用した際 InfoPanel が現れてびっくりしないために、最初から表示するようにしています。
    viewMode: 'GENERAL'
}

const actionCreator = actionCreatorFactory();
/**
 * InfoPanel の表示を切り替えます。
 */
export const toggleInfoPanel = actionCreator<{ isOpened?: boolean }>("TOGGLE_INFOPANEL");
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
        isOpened: payload?.isOpened !== undefined ? payload.isOpened : !state.isOpened
    }))
    .case(switchInfoPanel, (state, payload) => ({
        ...state,
        viewMode: payload.mode
    }))
    .case(showPartsEdit, (state, payload) => {
        if (payload.number === 0) {
            switch (payload.type) {
                case PartsType.OBJECT:
                    showError({ errorMessage: "パーツ番号０の物体は編集できません。\nこのパーツはマップの物体を消去するときに指定してください。" });
                    break;
                case PartsType.MAP:
                    showError({ errorMessage: "パーツ番号０の背景は編集できません。\nこのパーツはマップの背景を消去するときに指定してください。" })
            }
            return state;
        }
        return {
            ...state,
            isOpened: true,
            viewMode: "PARTS_EDIT",
            partsEdit: payload
        }
    })
