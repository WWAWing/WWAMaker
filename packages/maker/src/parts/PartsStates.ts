import { ObjectPartsType, MapPartsType } from "../classes/WWAData";
import { Action } from "redux";
import actionCreatorFactory from "typescript-fsa";
import { reducerWithInitialState } from "typescript-fsa-reducers";

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
/**
 * 物体パーツを選択します。
 */
export const selectObjParts = actionCreator<number>('SELECT_OBJECT_PARTS');

interface SelectMapPartsAction extends SelectPartsCommonAction {
}
/**
 * 背景パーツを選択します。
 */
export const selectMapParts = actionCreator<number>('SELECT_MAP_PARTS');

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

export const partsReducer = reducerWithInitialState(defaultPartsState)
    .case(selectObjParts, (state, selectPartsNumber) => ({
        ...state,
        selectObject: selectPartsNumber
    }))
    .case(selectMapParts, (state, selectPartsNumber) => ({
        ...state,
        selectMap: selectPartsNumber
    }));
