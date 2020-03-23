import { LoadState } from "./load/LoadStates";
import WWAData from "./classes/WWAData";
import { createStore, combineReducers, applyMiddleware, Reducer, Action } from "redux";
import thunkMiddleware from 'redux-thunk';
import { reducerWithInitialState } from "typescript-fsa-reducers";
import actionCreatorFactory from "typescript-fsa";
import { LoadStage } from "./load/Loader";

/**
 * Store の Type です。
 */
interface StoreType {
    mapdata: WWAMapData[],
    currentMapdata: number
}

/**
 * 開いている1つ1つのマップデータの Redux ステートです。
 */
interface WWAMapData {
    load: LoadState,
    wwaData: WWAData|null
}

/**
 * StoreType の初期値です。
 */
const INITIAL_STATE: StoreType = {
    mapdata: [],
    currentMapdata: 0
}

const actionCreator = actionCreatorFactory();
const openMapdata = actionCreator('OPEN_MAPDATA');
const completeOpenMapdata = actionCreator<{ mapdataNumber: number, wwaData: WWAData }>('COMPLETE_OPEN_MAPDATA');
const closeMapdata = actionCreator<{ mapdataNumber: number }>('CLOSE_MAPDATA');

/**
 * root の Reducer です。
 * @todo マップデータ操作に関わるアクションが増えすぎた場合は別の措置を考える
 * @todo ある程度完成したら、 state/index.ts からこのファイルに store を切り替える
 */
const reducer = reducerWithInitialState(INITIAL_STATE)
    .case(openMapdata, (state) => {
        const newState = Object.assign({}, state);
        newState.mapdata.push({
            load: {
                progress: LoadStage.INIT,
                error: null
            },
            wwaData: null
        });
        newState.currentMapdata = newState.mapdata.length - 1;
        return newState;
    })
    .case(completeOpenMapdata, (state, params) => {
        const newState = Object.assign({}, state);
        newState.mapdata[params.mapdataNumber].wwaData = params.wwaData;
        return newState;
    })
    .case(closeMapdata, (state, { mapdataNumber }) => {
        const newState = Object.assign({}, state);
        newState.mapdata.splice(mapdataNumber, 1);
        return newState;
    })

export const Store = createStore(
    reducer,
    applyMiddleware(thunkMiddleware)
);
