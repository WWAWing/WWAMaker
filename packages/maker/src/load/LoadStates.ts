import { reducerWithInitialState } from "typescript-fsa-reducers";
import actionCreatorFactory from "typescript-fsa";
import { LoadStage, LoaderError } from "./Loader";
import WWAData from "../classes/WWAData";
const actionCreator = actionCreatorFactory();

/**
 * [WIP] Load モジュールについて
 *     WWA Maker の Load モジュールはマップデータの読み込みに関する状態を管理しています。
 *     読み込みの開始 → 読み込みの途中経過 → 読み込み完了/読み込みエラー の際にこの Load モジュールが働きます。
 * @todo MapData.ts から順次移行する
 * @see MapData
 */
export interface LoadState {
    progress: LoadStage,
    error: LoaderError|null
}

const INITIAL_STATE: LoadState = {
    progress: LoadStage.INIT,
    error: null
};

export const loadWWAData = actionCreator.async<{mapdataFileName: string},
                                               {wwaData: WWAData}
                                              >('LOAD_MAPDATA');
const startLoad = actionCreator<string>("START_LOAD");

reducerWithInitialState(INITIAL_STATE)
    .case(startLoad, (state, name) => {
        const newState = Object.assign({}, state);
        newState.progress = LoadStage.MAP_ATTR;

        return newState;
    });
