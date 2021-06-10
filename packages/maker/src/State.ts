import { LoadState, loadReducer } from "./load/LoadStates";
import { PartsState, objectPartsReducer, mapPartsReducer } from "./parts/PartsState";
import { MapState, mapReducer } from "./map/MapStates";
import { InfoPanelState, infoPanelReducer } from "./info/InfoPanelState";
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
    {
        wwaData: null,
        imageUrl: null
    } as StoreType,
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
    load: loadReducer,
    wwaData: wwaDataReducer,
    map: mapReducer,
    objParts: objectPartsReducer,
    mapParts: mapPartsReducer,
    info: infoPanelReducer
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
