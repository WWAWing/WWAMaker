import { createAction, createReducer } from "@reduxjs/toolkit";
import { PartsType } from "../classes/WWAData";

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

/**
 * パーツ編集画面を表示するために必要な情報を示します。
 */
export interface InfoPanelPartsEditState {
    type: PartsType,
    number: number
}

export const INITIAL_STATE: InfoPanelState = {
    isOpened: true, // 始めて利用した際 InfoPanel が現れてびっくりしないために、最初から表示するようにしています。
    viewMode: 'GENERAL'
}

/**
 * InfoPanel の表示を切り替えます。
 */
export const toggleInfoPanel = createAction<{ isOpened?: boolean }>("TOGGLE_INFOPANEL");
/**
 * InfoPanel で表示する内容を変更します。
 */
export const switchInfoPanel = createAction<{ mode: InfoPanelMode }>("SWITCH_INFOPANEL");
/**
 * パーツ編集を表示します。
 */
export const showPartsEdit = createAction<InfoPanelPartsEditState>("SHOW_PARTS_EDIT");

export const InfoPanelReducer = createReducer(INITIAL_STATE, builder => {
    builder
        .addCase(toggleInfoPanel, (state, { payload }) => ({
            ...state,
            isOpened: payload?.isOpened !== undefined ? payload.isOpened : !state.isOpened
        }))
        .addCase(switchInfoPanel, (state, { payload }) => ({
            ...state,
            viewMode: payload.mode
        }))
        .addCase(showPartsEdit, (state, { payload }) => {
            // TODO: Reducer の中にアラートを表示するのはちょっと良くないかもしれない。別の場所に移しておきたい。
            if (payload.number === 0) {
                switch (payload.type) {
                    case PartsType.OBJECT:
                        alert("パーツ番号０の物体は編集できません。\nこのパーツはマップの物体を消去するときに指定してください。");
                        break;
                    case PartsType.MAP:
                        alert("パーツ番号０の背景は編集できません。\nこのパーツはマップの背景を消去するときに指定してください。");
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
});
