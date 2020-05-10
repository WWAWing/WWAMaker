import React, { useRef, useEffect, useMemo } from "react";
import { Coord } from "@wwawing/common-interface";
import WWAConsts from "../../classes/WWAConsts";

/**
 * 一番下に敷かれる背景色です。
 */
const MAP_CANVAS_BASE_COLOR = '#000';
/**
 * 画面境界線のグリッド色です。
 */
const MAP_BORDER_GRID_COLOR = "#f00";
const MAP_BORDER_GRID_WIDTH = 2;

/**
 * マップから要素のサイズを取得します。
 * @param map 
 */
const getElementSize = (map: Coord[][][]) => {
    return {
        x: map[0][0].length * WWAConsts.CHIP_SIZE,
        y: map[0].length * WWAConsts.CHIP_SIZE
    };
};

/**
 * 1画面程度の画面を描画する Canvas 要素です。
 *     プロパティ map はイメージ画像で参照される場所の座標を記載した配列になっています。
 */
const MapChunk: React.FC<{
    map: Coord[][][],
    showGrid?: boolean,
    image: CanvasImageSource
}> = props => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current === null) {
            return;
        }
        const context = canvasRef.current.getContext('2d');
        if (context === null) {
            return;
        }

        const elementSize = getElementSize(props.map);
        context.fillStyle = MAP_CANVAS_BASE_COLOR;
        context.fillRect(0, 0, elementSize.x, elementSize.y);

        props.map.forEach((layer, index) => {
            layer.forEach((line, y) => {
                line.forEach((imageCropCoord, x) => {
                    if (imageCropCoord.x === 0 && imageCropCoord.y === 0) {
                        return;
                    }
                    context.drawImage(
                        props.image,
                        imageCropCoord.x,
                        imageCropCoord.y,
                        WWAConsts.CHIP_SIZE,
                        WWAConsts.CHIP_SIZE,
                        x * WWAConsts.CHIP_SIZE,
                        y * WWAConsts.CHIP_SIZE,
                        WWAConsts.CHIP_SIZE,
                        WWAConsts.CHIP_SIZE
                    );
                });
            });
        });

        if (props.showGrid) {
            context.strokeStyle = MAP_BORDER_GRID_COLOR;
            context.lineWidth = MAP_BORDER_GRID_WIDTH;
    
            context.beginPath();
            context.moveTo(WWAConsts.CHIP_SIZE / 2, 0);
            context.lineTo(WWAConsts.CHIP_SIZE / 2, elementSize.y);
            context.moveTo(0, WWAConsts.CHIP_SIZE / 2);
            context.lineTo(elementSize.x, WWAConsts.CHIP_SIZE / 2);
            context.stroke();
            context.closePath();
        }
    }, [props.map, props.showGrid, props.children, props.image]);


    const elementSize = useMemo(() => getElementSize(props.map), [props.map]);

    return (
        <canvas
            ref={canvasRef}
            width={elementSize.x}
            height={elementSize.y}
        />
    );
};

export default MapChunk;
