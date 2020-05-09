import React, { useRef, useState } from 'react';
import WWAConsts from '../../classes/WWAConsts';
import styles from './index.module.scss';
import { CHUNK_SIZE, MapLayer, FieldMapLayer, ChipLayer } from "./MapLayer";
import MapChunk from './MapChunk';
import { PartsType } from '../../classes/WWAData';
import getPosEachChip from '../getPosEachChip';
import { useImage } from "wwamaker-image-decorder";
import { useSelector } from 'react-redux';
import { Coord } from '@wwawing/common-interface';

/**
 * クリックした先のパーツ情報の1レイヤー分です。
 *     後述の MouseEventFunc で使用します。
 */
export type TargetParts = {[key in PartsType]: number};

/**
 * マウス操作を行った場合に親コンポーネントに実行されるメソッドの型です。
 *     chipX と chipY はクリックした先の座標 (マス単位) です。
 *     parts はマウス操作を行った先にあるパーツの種類とパーツ番号です。
 *     編集モードの際に対象のパーツ情報を取得する場合に使用します。
 */
export type MouseEventFunc = (chipX: number, chipY: number, parts: TargetParts) => void;

export interface Props {
    onMouseDown: MouseEventFunc;
    onMouseMove: MouseEventFunc;
    onMouseDrag: MouseEventFunc;
    onMouseUp: MouseEventFunc;
    onContextMenu?: MouseEventFunc;
}

/**
 * マップを表示する Canvas です。
 */
const MapCanvas: React.FC<Props> = props => {

    const fieldMap: MapLayer[] = useSelector(state => {
        if (state.wwaData === null || state.image === null) {
            return [];
        }

        return [
            new FieldMapLayer(
                PartsType.MAP,
                state.wwaData.map,
                state.wwaData.mapAttribute
            ),
            new ChipLayer(
                {
                    x: state.wwaData.playerX,
                    y: state.wwaData.playerY
                }, {
                    x: (WWAConsts.IMGPOS_DEFAULT_PLAYER_X + WWAConsts.IMGRELPOS_PLAYER_DOWN_X) * WWAConsts.CHIP_SIZE,
                    y: WWAConsts.IMGPOS_DEFAULT_PLAYER_Y * WWAConsts.CHIP_SIZE
                },
                state.wwaData.mapWidth
            ),
            new FieldMapLayer(
                PartsType.OBJECT,
                state.wwaData.mapObject,
                state.wwaData.objectAttribute
            )
        ];
    }, (leftLayers, rightLayers) => {
        if (leftLayers.length !== rightLayers.length) {
            return true;
        }
        return leftLayers.some((leftLayer, layerIndex) => {
            const rightLayer = rightLayers[layerIndex];
            return leftLayer.isDifference(rightLayer);
        });
    });

    const mapWidth = useSelector(state => state.wwaData?.mapWidth) ?? 0;
    const showGrid = useSelector(state => state.map.showGrid);
    const imageUrl = useSelector(state => state.image);
    const image = useImage(imageUrl ?? "");
    const [hasClick, setClick] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseDown = (event: React.MouseEvent) => {
        // 右クリックによるコンテキストメニューの表示では、クリックイベントも同時に行われるので、その場合は処置をキャンセルします。
        if (event.button === 2 && props.onContextMenu !== undefined) {
            return;
        }

        setClick(true);
        callByMousePos(event, props.onMouseDown);
    };

    /**
     * マウスの現在位置とクリック状態を出力し、プロパティに記載された処理を実行させます。
     */
    const handleMouseMove = (event: React.MouseEvent) => {
        if (hasClick) {
            callByMousePos(event, props.onMouseDrag);
        } else {
            callByMousePos(event, props.onMouseMove);
        }
    };

    const handleMouseUp = (event: React.MouseEvent) => {
        if (!hasClick) {
            return;
        }

        setClick(false);
        callByMousePos(event, props.onMouseUp);
    };

    const handleContextMenu = (event: React.MouseEvent) => {
        if (props.onContextMenu === undefined) {
            return;
        }

        event.preventDefault();
        callByMousePos(event, props.onContextMenu);
    };

    /**
     * マウスイベントから指定したメソッドを呼び出します。
     * @param event マウスイベントのメソッド
     * @param func 実行したいメソッド (主にプロパティの onMouseXX メソッドを割り当てる際に使用)
     */
    const callByMousePos = (event: React.MouseEvent, func: MouseEventFunc) => {
        const clientRect = ref.current?.getBoundingClientRect();
        if (!clientRect) {
            return;
        }

        const [chipX, chipY] = getPosEachChip(event.clientX - clientRect.left, event.clientY - clientRect.top);
        func(chipX, chipY, {
            [PartsType.MAP]: getPartsNumberOnTarget(chipX, chipY, PartsType.MAP),
            [PartsType.OBJECT]: getPartsNumberOnTarget(chipX, chipY, PartsType.OBJECT)
        });
    }

    /**
     * 指定した座標から各パーツ種類のパーツ番号を取得します
     * @param chipX 
     * @param chipY 
     */
    const getPartsNumberOnTarget = (chipX: number, chipY: number, type: PartsType) => {
        const targetLayer = fieldMap.find(layer => {
            return layer instanceof FieldMapLayer && layer.getPartsType() === type
        });
        if (targetLayer === undefined) {
            return 0;
        }

        return (targetLayer as FieldMapLayer).getPartsNumber(chipX, chipY);
    }


    if (image === null) {
        return null;
    }

    const chunkCount = Math.ceil(mapWidth / CHUNK_SIZE);
    /**
     * チャンクY, チャンクX, レイヤー, マスY, マスX
     */
    let chunks: Coord[][][][][] = [];
    for (let chunkY = 0; chunkY < chunkCount; chunkY++) {
        chunks[chunkY] = [];
        for (let chunkX = 0; chunkX < chunkCount; chunkX++) {
            chunks[chunkY][chunkX] = [];
        }
    }

    fieldMap.forEach(layer => {
        for (let chunkY = 0; chunkY < chunkCount; chunkY++) {
            for (let chunkX = 0; chunkX < chunkCount; chunkX++) {
                const chunk = layer.getMapChunk(chunkX, chunkY);
                if (chunk !== undefined) {
                    chunks[chunkY][chunkX].push(chunk);
                }
            }
        }
    });

    return (
        <div
            className={styles.mapCanvas}
            ref={ref}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onContextMenu={handleContextMenu}
        >
            {chunks.map((chunkLine, chunkLineIndex) => (
                <div className={styles.mapCanvasLine} key={chunkLineIndex}>
                    {chunkLine.map((chunk, chunkColumnIndex) => (
                        <MapChunk
                            key={chunkColumnIndex}
                            map={chunk}
                            showGrid={showGrid}
                            image={image}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default MapCanvas;
