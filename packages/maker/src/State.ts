import { LoadState, LoadReducer, INITIAL_STATE as LOAD_INITIAL_STATE } from "./load/LoadStates";
import { PartsState, INITIAL_STATE as PARTS_INITIAL_STATE, ObjectPartsReducer, MapPartsReducer } from "./parts/PartsState";
import { MapState, INITIAL_STATE as MAP_INITIAL_STATE, MapReducer } from "./map/MapStates";
import { InfoPanelState, INITIAL_STATE as INFOPANEL_INITIAL_STATE, InfoPanelReducer } from "./info/InfoPanelState";
import { WWAData } from "@wwawing/common-interface";
import { WWADataReducer } from "./wwadata/WWADataState";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk';
import { reducerWithInitialState } from "typescript-fsa-reducers";
import actionCreatorFactory from "typescript-fsa";
import { composeWithDevTools } from "redux-devtools-extension";

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

const actionCreator = actionCreatorFactory();
/**
 * マップデータの情報を設定します。
 */
export const setMapdata = actionCreator<{ wwaData: WWAData }>('OPEN_MAPDATA');
/**
 * 画像リソースを設定します。
 */
export const setImage = actionCreator<{ imageUrl: string }>('OPEN_IMAGE');
/**
 * 開いているマップデータと画像リソースを閉じます。
 */
export const closeMapdata = actionCreator('CLOSE_MAPDATA');

/**
 * root の Reducer です。
 */
const reducer = reducerWithInitialState(INITIAL_STATE)
    .case(setMapdata, (state, params) => {
        const newState = Object.assign({}, state);
        newState.wwaData = params.wwaData;
        return newState;
    })
    .case(setImage, (state, params) => {
        if (state.imageUrl !== null) {
            URL.revokeObjectURL(state.imageUrl);
        }
        return {
            ...state,
            imageUrl: params.imageUrl
        };
    })
    .case(closeMapdata, (state) => {
        if (state.imageUrl !== null) {
            URL.revokeObjectURL(state.imageUrl);
        }
        const newState = Object.assign({}, state);
        newState.wwaData = null;
        newState.imageUrl = null;
        return newState;
    })
    .default((state, action) => ({
        ...state,
        load: LoadReducer(state.load, action),
        wwaData: WWADataReducer(state.wwaData, action),
        map: MapReducer(state.map, action),
        objParts: ObjectPartsReducer(state.objParts, action),
        mapParts: MapPartsReducer(state.mapParts, action),
        info: InfoPanelReducer(state.info, action)
    }))

export const Store = createStore(
    reducer,
    composeWithDevTools(
        applyMiddleware(thunkMiddleware)
    )
);
