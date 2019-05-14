import WWAData from "../classes/WWAData";

type WWADataActionType = 'LOAD_WWADATA' | 'SAVE_WWADATA';

/**
 * Action Creator
 * @param wwaData 
 */
export function setWWAData(wwaData: WWAData): WWADataAction {
    return {
        type: 'LOAD_WWADATA',
        payload: wwaData
    }
}

export interface WWADataAction {
    type: WWADataActionType;
    payload: WWAData;
};

const currentVersion = 32;
const defaultWWAData: WWAData = {
    version: currentVersion,

    gameoverX: 0,
    gameoverY: 0,

    playerX: 0,
    playerY: 0,

    mapPartsMax: 100,
    objPartsMax: 100,

    isOldMap: false,

    statusEnergyMax: 0,
    statusEnergy: 0,
    statusStrength: 0,
    statusDefence: 0,
    statusGold: 0,

    itemBox: [],

    mapWidth: 101,
    messageNum: 0,

    map: [],
    mapObject: [],

    mapCompressed: [],
    mapObjectCompressed: [],

    mapAttribute: [],
    objectAttribute: [],

    worldPassword: '',
    message: [],
    worldName: '',
    worldPassNumber: 0,
    charCGName: '',
    mapCGName: '',
    systemMessage: [],
    moves: 0,

    yesnoImgPosX: 3,
    yesnoImgPosY: 4,
    playerImgPosX: 2,
    playerImgPosY: 0,
    clickableItemSignImgPosX: 0,
    clickableItemSignImgPosY: 0,

    disableSaveFlag: false,
    compatibleForOldMapFlag: false,
    objectNoCollapseDefaultFlag: false,

    delPlayerFlag: false,

    bgm: 0,
    effectCoords: [],
    effectWaits: 0,

    imgClickX: 0,
    imgClickY: 0,

    frameColorR: 0,
    frameColorG: 0,
    frameColorB: 0,

    frameOutColorR: 0,
    frameOutColorG: 0,
    frameOutColorB: 0,

    fontColorR: 0,
    fontColorG: 0,
    fontColorB: 0,

    statusColorR: 0,
    statusColorG: 0,
    statusColorB: 0,
    checkOriginalMapString: '',
    checkString: '',
    
    isItemEffectEnabled: false
}

export function WWADataReducer (state: WWAData = defaultWWAData, action: WWADataAction): WWAData {
    switch (action.type) {
        case 'LOAD_WWADATA':
            // TODO: 読み込み処理を実装する
            return Object.assign({}, action.payload);
    }
    return state;
}
