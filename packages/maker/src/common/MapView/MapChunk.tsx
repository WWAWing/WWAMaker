import React from "react";
import { Coord } from "@wwawing/common-interface";
import WWAConsts from "../../classes/WWAConsts";

/**
 * 一番下に敷かれる背景色です。
 */
const MAP_CANVAS_BASE_COLOR = '#000';

/**
 * 1画面程度の画面を描画する Canvas 要素です。
 *     プロパティ map はイメージ画像で参照される場所の座標を記載した配列になっています。
 */
export default class MapChunk extends React.Component<{
    map: Coord[][][],
    image: CanvasImageSource
}> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props: MapChunk["props"]) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.draw();
    }

    componentDidUpdate() {
        this.draw();
    }

    /**
     * 各マスの変更を確認し、変更が見つかった場合にだけ componentDidUpdate を実行させます。
     */
    shouldComponentUpdate(prevProps: MapChunk["props"]) {
        return prevProps.map.some((line, lineIndex) =>
            line.some((layer, layerIndex) =>
                layer.some((imageCoord, index) =>
                    imageCoord.x !== this.props.map[lineIndex][layerIndex][index].x ||
                    imageCoord.y !== this.props.map[lineIndex][layerIndex][index].y
                )
            )
        );
    }

    private draw() {
        if (this.canvasRef.current === null) {
            return;
        }
        const context = this.canvasRef.current.getContext('2d');
        if (context === null) {
            return;
        }

        const elementSize = this.getElementSize();
        context.fillStyle = MAP_CANVAS_BASE_COLOR;
        context.fillRect(0, 0, elementSize.x, elementSize.y);

        this.props.map.forEach((layer, index) => {
            layer.forEach((line, y) => {
                line.forEach((imageCropCoord, x) => {
                    if (imageCropCoord.x === 0 && imageCropCoord.y === 0) {
                        return;
                    }
                    context.drawImage(
                        this.props.image,
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
    }

    private getElementSize(): Coord {
        return {
            x: this.props.map[0][0].length * WWAConsts.CHIP_SIZE,
            y: this.props.map[0].length * WWAConsts.CHIP_SIZE
        };
    }

    public render() {
        const elementSize = this.getElementSize();
        return (
            <canvas
                ref={this.canvasRef}
                width={elementSize.x}
                height={elementSize.y}
            />
        );
    }
};
