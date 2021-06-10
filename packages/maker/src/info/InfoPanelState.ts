import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

export const initialState: InfoPanelState = {
    isOpened: true, // 始めて利用した際 InfoPanel が現れてびっくりしないために、最初から表示するようにしています。
    viewMode: 'GENERAL'
}

export const infoPanelSlice = createSlice({
    name: 'infopanel',
    initialState,
    reducers: {
        /**
         * InfoPanel の表示を切り替えます。
         */
        toggleInfoPanel: state => {
            state.isOpened = !state.isOpened;
        },
        /**
         * InfoPanel で表示する内容を変更します。
         */
        switchInfoPanel: (state, action: PayloadAction<InfoPanelMode>) => {
            state.viewMode = action.payload;
        },
        /**
         * パーツ編集を表示します。
         */
        showPartsEdit: (state, action: PayloadAction<InfoPanelPartsEditState>) => {
            state.partsEdit = action.payload;
        }
    }
});

export const { toggleInfoPanel, switchInfoPanel, showPartsEdit } = infoPanelSlice.actions;

export const InfoPanelReducer = infoPanelSlice.reducer;
