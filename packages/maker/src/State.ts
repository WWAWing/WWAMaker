import { LoadState, LoadReducer, INITIAL_STATE as LOAD_INITIAL_STATE } from "./load/LoadStates";
import { PartsState, INITIAL_STATE as PARTS_INITIAL_STATE, ObjectPartsReducer, MapPartsReducer } from "./parts/PartsState";
import WWAData, { defaultWWAData } from "./classes/WWAData";
import { WWADataReducer } from "./wwadata/WWADataState";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk';
import { reducerWithInitialState } from "typescript-fsa-reducers";
import actionCreatorFactory from "typescript-fsa";
import { EditMode } from "./map/MapStates";

/**
 * Store の Type です。
 */
export interface StoreType {
    load: LoadState,
    wwaData: WWAData|null,
    editMode: EditMode
    objParts: PartsState,
    mapParts: PartsState,
    image: CanvasImageSource|null
}

/**
 * StoreType の初期値です。
 * @todo 物体/背景パーツのステートについては別ファイルにまとめておく
 */
const INITIAL_STATE: StoreType = {
    load: LOAD_INITIAL_STATE,
    wwaData: defaultWWAData,
    editMode: EditMode.PUT_MAP,
    objParts: PARTS_INITIAL_STATE,
    mapParts: PARTS_INITIAL_STATE,
    image: null
}

const actionCreator = actionCreatorFactory();
export const setMapdata = actionCreator<{ wwaData: WWAData }>('OPEN_MAPDATA');
export const setImage = actionCreator<{ imageSource: CanvasImageSource }>('OPEN_IMAGE');
const closeMapdata = actionCreator('CLOSE_MAPDATA');

/**
 * root の Reducer です。
 * @see mapdataReducer
 */
const reducer = reducerWithInitialState(INITIAL_STATE)
    .case(setMapdata, (state, params) => {
        const newState = Object.assign({}, state);
        newState.wwaData = params.wwaData;
        return newState;
    })
    .case(setImage, (state, params) => ({
        ...state,
        image: params.imageSource
    }))
    .case(closeMapdata, (state) => {
        const newState = Object.assign({}, state);
        newState.wwaData = null;
        newState.image = null;
        return newState;
    })
    .default((state, action) => ({
        ...state,
        load: LoadReducer(state.load, action),
        wwaData: WWADataReducer(state.wwaData === null ? undefined : state.wwaData, action),
        objParts: ObjectPartsReducer(state.objParts, action),
        mapParts: MapPartsReducer(state.mapParts, action)
    }))

export const Store = createStore(
    reducer,
    applyMiddleware(thunkMiddleware)
);