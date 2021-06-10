import { LoadState, LoadReducer, INITIAL_STATE as LOAD_INITIAL_STATE } from "./load/LoadStates";
import { PartsState, INITIAL_STATE as PARTS_INITIAL_STATE, ObjectPartsReducer, MapPartsReducer } from "./parts/PartsState";
import { MapState, INITIAL_STATE as MAP_INITIAL_STATE, MapReducer } from "./map/MapStates";
import { InfoPanelState, initialState as INFOPANEL_INITIAL_STATE, InfoPanelReducer } from "./info/InfoPanelState";
import { WWAData } from "@wwawing/common-interface";
import { wwaDataReducer } from "./wwadata/WWADataState";
import thunkMiddleware from 'redux-thunk';
import { configureStore, createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";

/**
 * Store の Type です。
 */
export interface StoreType {
    load: LoadState,
    wwaData: WWAData|null,
    map: MapState,
    objParts: PartsState,
    mapParts: PartsState,
    imageUrl: string|null,
    info: InfoPanelState
}

/**
 * StoreType の初期値です。
 * @todo 物体/背景パーツのステートについては別ファイルにまとめておく
 */
const INITIAL_STATE: StoreType = {
    load: LOAD_INITIAL_STATE,
    wwaData: null,
    map: MAP_INITIAL_STATE,
    objParts: PARTS_INITIAL_STATE,
    mapParts: PARTS_INITIAL_STATE,
    imageUrl: null,
    info: INFOPANEL_INITIAL_STATE
}

/**
 * マップデータの情報を設定します。
 */
export const setMapdata = createAction<WWAData>('OPEN_MAPDATA');
/**
 * 画像リソースを設定します。
 */
export const setImage = createAction<string>('OPEN_IMAGE');
/**
 * 開いているマップデータと画像リソースを閉じます。
 */
export const closeMapdata = createAction('CLOSE_MAPDATA');

/**
 * root の Reducer です。
 */
const rootReducer = createReducer(
    INITIAL_STATE,
    builder => builder
        .addCase(setMapdata, (state, action: PayloadAction<WWAData>) => {
            state.wwaData = action.payload;
        })
        .addCase(setImage, (state, action: PayloadAction<string>) => {
            if (state.imageUrl !== null) {
                URL.revokeObjectURL(state.imageUrl);
            }
            state.imageUrl = action.payload;
        })
        .addCase(closeMapdata, state => {
            if (state.imageUrl !== null) {
                URL.revokeObjectURL(state.imageUrl);
            }
            state.wwaData = null;
            state.imageUrl = null;
        })
);

const reducer = {
    ...rootReducer,
    load: LoadReducer,
    wwaData: wwaDataReducer,
    map: MapReducer,
    objParts: ObjectPartsReducer,
    mapParts: MapPartsReducer,
    info: InfoPanelReducer
};

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript
 */
export const Store = configureStore({
    reducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware()
            .prepend(
                thunkMiddleware
            ),
    devTools: process.env.NODE_ENV !== 'production'
});
