import { Coord } from "@wwawing/common-interface";
import WWAConsts from "../../classes/WWAConsts";
import { PartsType } from "../../classes/WWAData";

/**
 * MapChunk のサイズです。超えた分は切り捨てます。
 */
export const CHUNK_SIZE = 10;

/**
 * MapCanvas で管理するレイヤーのインターフェイスです。
 *     WWAのマップ表示は 背景パーツ → プレイヤー → 物体パーツ の順番で重ねています。
 *     背景パーツ/物体パーツ と プレイヤー で描画の仕方は異なるため、インターフェイスで部分的に共通化しています。
 */
export interface MapLayer {
    /**
     * フィールドから1レイヤー分のチャンクを生成します。
     * @param chunkX 現在のチャンクのX座標
     * @param chunkY 現在のチャンクのY座標
     * @returns 生成したチャンク (生成する必要がなければ undefined )
     */
    getMapChunk(chunkX: number, chunkY: number): Coord[][] | undefined;
}

/**
 * FieldMapLayer はマップに描画するレイヤーです。
 *     背景パーツや物体パーツで全体に敷くものになります。
 */
export class FieldMapLayer implements MapLayer {
    /**
     * 対応しているパーツ種類 (右クリックの挙動でパーツ種類を調べる目的で使用)
     */
    private partsType: PartsType;
    /**
     * フィールドマップ (個々の項目はパーツ番号)
     */
    private fieldMap: number[][];
    /**
     * 各パーツ番号に対応したイメージの X座標 と Y座標
     */
    private imageCrops: Coord[];

    constructor(partsType: PartsType, fieldMap: number[][], attributes: number[][]) {
        this.partsType = partsType;

        const getCrops = (attribute: number[]): Coord => {
            return {
                x: attribute[WWAConsts.ATR_X],
                y: attribute[WWAConsts.ATR_Y]
            };
        };

        this.fieldMap = fieldMap;
        this.imageCrops = attributes.map(getCrops);
    }

    public getPartsType() {
        return this.partsType;
    }

    public getPartsNumber(chipX: number, chipY: number) {
        return this.fieldMap[chipY][chipX];
    }

    public getMapChunk(chunkX: number, chunkY: number) {
        const startChipX = chunkX * CHUNK_SIZE;
        const startChipY = chunkY * CHUNK_SIZE;
        return this.fieldMap.slice(startChipY, startChipY + CHUNK_SIZE).map(chunkLine => {
            return chunkLine.slice(startChipX, startChipX + CHUNK_SIZE).map(partsNumber => {
                return this.imageCrops[partsNumber];
            });
        });
    }
}

/**
 * ChipLayer は1マスだけ描画するレイヤーです。
 *     プレイヤーの位置を示す際に使用します。
 */
export class ChipLayer implements MapLayer {
    /**
     * マップ内に存在するチャンクの位置
     */
    private chunkPosition: Coord;

    constructor(
        private position: Coord,
        private crop: Coord,
        private mapWidth: number
    ) {
        this.chunkPosition = {
            x: Math.floor(this.position.x / CHUNK_SIZE),
            y: Math.floor(this.position.y / CHUNK_SIZE)
        };
    }

    public getMapChunk(chunkX: number, chunkY: number) {
        if (chunkX !== this.chunkPosition.x || chunkY !== this.chunkPosition.y) {
            return undefined;
        }

        let targetMap: Coord[][] = [];
        const endChipY = Math.min(this.mapWidth, (chunkY + 1) * CHUNK_SIZE);
        for (let chipY = chunkY * CHUNK_SIZE; chipY < endChipY; chipY++) {
            targetMap[chipY] = [];
            const endChipX = Math.min(this.mapWidth, (chunkX + 1) * CHUNK_SIZE);
            for (let chipX = chunkX * CHUNK_SIZE; chipX < endChipX; chipX++) {
                targetMap[chipY][chipX] = chipX === this.position.x && chipY === this.position.y
                    ? this.crop
                    : { x: 0, y: 0 };
            }
        }

        return targetMap;
    }
}
