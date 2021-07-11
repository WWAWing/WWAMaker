import { loadReducer } from "./load/LoadStates";
import { objectPartsReducer, mapPartsReducer } from "./parts/PartsState";
import { mapReducer } from "./map/MapStates";
import { infoPanelReducer } from "./info/InfoPanelState";
import { wwaDataReducer } from "./wwadata/WWADataState";
import thunkMiddleware from 'redux-thunk';
import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { imageReducer } from "./image/ImageState";
import { modalReducer } from "./modal/ModalState";

const reducer = combineReducers({
    load: loadReducer,
    wwaData: wwaDataReducer,
    map: mapReducer,
    objParts: objectPartsReducer,
    mapParts: mapPartsReducer,
    image: imageReducer,
    info: infoPanelReducer,
    modal: modalReducer
});

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript
 * @todo immuitableCheck と serializableCheck を切らなくてはならないほど State の変更が大きいので、なるべくこれらの確認の負担を減らすように工夫する
 */
export const Store = configureStore({
    reducer,
    middleware: getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false
    }).concat(
        thunkMiddleware
    ),
    devTools: process.env.NODE_ENV !== 'production'
});

export type StoreType = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
