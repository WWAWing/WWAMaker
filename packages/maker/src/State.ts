import { LoadState, LoadReducer, INITIAL_STATE as LOAD_INITIAL_STATE } from "./load/LoadStates";
import WWAData, { defaultWWAData } from "./classes/WWAData";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk';
import { reducerWithInitialState } from "typescript-fsa-reducers";
import actionCreatorFactory from "typescript-fsa";
import { EditMode } from "./map/MapStates";

/**
 * Store の Type です。
 */
interface StoreType {
    load: LoadState,
    wwaData: WWAData|null,
    editMode: EditMode
    objParts: {
        number: number
    },
    mapParts: {
        number: number
    }
}

/**
 * StoreType の初期値です。
 * @todo 物体/背景パーツのステートについては別ファイルにまとめておく
 */
const INITIAL_STATE: StoreType = {
    load: LOAD_INITIAL_STATE,
    wwaData: defaultWWAData,
    editMode: EditMode.PUT_MAP,
    objParts: {
        number: 0
    },
    mapParts: {
        number: 0
    }
}

const actionCreator = actionCreatorFactory();
export const setMapdata = actionCreator<{ wwaData: WWAData }>('COMPLETE_OPEN_MAPDATA');
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
    .case(closeMapdata, (state) => {
        const newState = Object.assign({}, state);
        newState.wwaData = null;
        return newState;
    })
    .default((state, action) => ({
        ...state,
        load: LoadReducer(state.load, action)
    }))

export const Store = createStore(
    reducer,
    applyMiddleware(thunkMiddleware)
);
