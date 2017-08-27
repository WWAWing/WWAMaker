import * as parts from './wwamk_parts'

const MAP_SIZE_MAXIMUM:number = 1001;
const OBJECT_PARTS_MAXIMUM:number = 4000;
const MAP_PARTS_MAXIMUM:number = 4000;
const SYSTEM_MESSAGE_MAXIMUM:number = 20;

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
  objectParts: parts.ObjectParts[] = new Array(OBJECT_PARTS_MAXIMUM);
  mapParts: parts.MapParts[] = new Array(MAP_PARTS_MAXIMUM);
  
  constructor() {

  }
}