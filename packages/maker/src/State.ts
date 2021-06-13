import { loadReducer } from "./load/LoadStates";
import { objectPartsReducer, mapPartsReducer } from "./parts/PartsState";
import { mapReducer } from "./map/MapStates";
import { infoPanelReducer } from "./info/InfoPanelState";
import { wwaDataReducer } from "./wwadata/WWADataState";
import thunkMiddleware from 'redux-thunk';
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { imageReducer } from "./image/ImageState";

const reducer = combineReducers({
    load: loadReducer,
    wwaData: wwaDataReducer,
    map: mapReducer,
    objParts: objectPartsReducer,
    mapParts: mapPartsReducer,
    image: imageReducer,
    info: infoPanelReducer
});

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

export type StoreType = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
