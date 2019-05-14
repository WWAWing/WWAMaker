import WWAData from "../../classes/WWAData";

/**
 * @todo 別のファイルに移行する
 */
interface WWADataAction {
    type: 'LOAD_WWADATA';
    wwaData: WWAData
};

export default function WWAData (state: WWAData, action: WWADataAction): WWAData {
    switch (action.type) {
        case 'LOAD_WWADATA':
            // TODO: 読み込み処理を実装する
            return Object.assign({}, action.wwaData);
    }
    return state;
}
