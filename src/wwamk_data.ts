/// <reference path="wwamk_main.ts" />

module wwamk_data {
  export class WWAData {
    worldName: string;
    mapCGName: string;
    playerX: number;
    playerY: number;
    gameoverX: number;
    gameoverY: number;
    statusEnergyMax: number;
    statusEnergy: number;
    statusStrength: number;
    statusDefence: number;
    statusGold: number;
    mapSize: number;
    objectPartsMax: number;
    mapPartsMax: number;
    systemMessage: number[] = new Array(SYSTEM_MESSAGE_MAXIMUM);
    objectMap: number[][] = new Array(MAP_SIZE_MAXIMUM);
    mapMap: number[][] = new Array(MAP_SIZE_MAXIMUM);
    objectParts:ObjectParts[] = new Array(OBJECT_PARTS_MAXIMUM);
    mapParts:MapParts[] = new Array(MAP_PARTS_MAXIMUM);
    
    constructor() {

    }
  }
}