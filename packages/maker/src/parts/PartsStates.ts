import { ObjectPartsType, MapPartsType } from "../classes/WWAData";
import { Action, ActionCreator } from "redux";
import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory();

export type PartsSelectActionType = 'SELECT_OBJECT_PARTS' | 'SELECT_MAP_PARTS';

/**
 * パーツの選択は、パーツ番号の指定だけになりますので、パーツ選択共通のアクションを設けます。
 */
interface SelectPartsCommonAction extends Action {
    type: PartsSelectActionType
    payload: {
        selectPartsNumber: number
    }
}

interface SelectObjPartsAction extends SelectPartsCommonAction {
}
export const selectObjParts = actionCreator<{selectPartsNumber: number}>('SELECT_OBJECT_PARTS');

interface SelectMapPartsAction extends SelectPartsCommonAction {
}
export const selectMapParts: ActionCreator<SelectMapPartsAction> = (partsNumber: number) => ({
    type: 'SELECT_MAP_PARTS',
    payload: {
        selectPartsNumber: partsNumber
    }
} as PartsAction);

export type PartsAction = SelectObjPartsAction & SelectMapPartsAction;

/**
 * パーツ種類の絞り込みに利用する enum です。
 *     例えばパーツ種類の絞り込み機能を実装する際は、すべてのパーツ種類を受け入れる設定を用意しなくてはなりません。
 *     この場合ですと、 ALL が必要ですので ALL が含まれています。
 *     この他にもパーツ種類の絞り込みで機能が増えた場合に増やすつもりです。
 */
enum PartsTypeForPartsSpecify {
    ALL = 0
}

export interface PartsState {
    selectObject: number;
    specifyObjectType: PartsTypeForPartsSpecify | ObjectPartsType;
    selectMap: number;
    specifyMapType: PartsTypeForPartsSpecify | MapPartsType;
}

export const defaultPartsState: PartsState = {
    selectObject: 0,
    specifyObjectType: PartsTypeForPartsSpecify.ALL,
    selectMap: 0,
    specifyMapType: PartsTypeForPartsSpecify.ALL
}

export function PartsReducer(state: PartsState, action: PartsAction): PartsState {
    switch (action.type) {
        case 'SELECT_OBJECT_PARTS': {
            const newState = Object.assign({}, state);
            newState.selectObject = action.payload.selectPartsNumber;

            return newState;
        }
        case 'SELECT_MAP_PARTS': {
            const newState = Object.assign({}, state);
            newState.selectMap = action.payload.selectPartsNumber;

            return newState;
        }
    }
    
    return state;
}
