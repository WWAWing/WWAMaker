import React, { RefObject } from 'react';
import WWAConsts from '../classes/WWAConsts';
import { Coord } from '@wwawing/common-interface';
import styles from './MapCanvas.module.scss';

/**
 * 一番下に敷かれる背景色です。
 */
const MAP_CANVAS_BASE_COLOR = '#000';

interface Props {
    map: number[][][];
    attribute: number[][][];
    mapSize: number;
    image: CanvasImageSource;
    selectRect?: {
        chipX: number,
        chipY: number,
        chipWidth: number,
        chipHeight: number
    },
    onMouseDown: (x: number, y: number) => void;
    onMouseMove: (x: number, y: number) => void;
    onMouseDrag: (x: number, y:number) => void;
    onMouseUp: (x: number, y: number) => void;
}

interface State {
    hasClick: boolean
}

/**
 * マップを表示する Canvas です。
 */
export default class MapCanvas extends React.Component<Props, State> {
    private elementRef: RefObject<HTMLDivElement>;
    public static defaultProps: Props = {
        map: [],
        attribute: [],
        mapSize: WWAConsts.MAP_SIZE_DEFAULT,
        image: new Image(),
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseDrag: () => {},
        onMouseUp: () => {}
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            hasClick: false
        };
        this.elementRef = React.createRef();
    }

    private handleMouseDown(event: React.MouseEvent) {
        this.setState({
            hasClick: true
        });

        const mousePos = this.getMousePos(event.clientX, event.clientY);
        if (!mousePos) {
            return;
        }

        this.props.onMouseDown(mousePos.mouseX, mousePos.mouseY);
    }

    /**
     * マウスの現在位置とクリック状態を出力し、プロパティに記載された処理を実行させます。
     */
    private handleMouseMove(event: React.MouseEvent) {
        const mousePos = this.getMousePos(event.clientX, event.clientY);
        if (!mousePos) {
            return;
        }
        
        if (this.state.hasClick) {
            this.props.onMouseDrag(mousePos.mouseX, mousePos.mouseY);
        } else {
            this.props.onMouseMove(mousePos.mouseX, mousePos.mouseY);
        }
    }

    private handleMouseUp(event: React.MouseEvent) {
        this.setState({
            hasClick: false
        });

        const mousePos = this.getMousePos(event.clientX, event.clientY);
        if (!mousePos) {
            return;
        }

        return this.props.onMouseUp(mousePos.mouseX, mousePos.mouseY);
    }

    /**
     * マウスの座標から要素内の現在位置を取得します。
     * @returns 要素内の現在位置 (px単位) Canvas の要素が取得できなければ null
     */
    private getMousePos(clientX: number, clientY: number): { mouseX: number, mouseY: number } | null {
        const rect = this.elementRef.current?.getBoundingClientRect();
        if (!rect) {
            return null;
        }

        return {
            mouseX: clientX - rect.left,
            mouseY: clientY - rect.top
        }
    }

    public render() {
        /**
         * 1つの Canvas 要素だけでは描画しきれないため、複数のチャンクに分割し、1チャンクに MapChunk コンポーネントを渡します。
         */
        let map: Coord[][][][][] = []; // チャンクY, チャンクX, レイヤー, マスY, マスX
        this.props.map.forEach((layer, layerIndex) => {

            let screenY = 0;
            for (let y = 1; y < layer.length; y += 10) {

                map[screenY] = layerIndex === 0 ? [] : map[screenY];
                const startSliceY = y === 1 ? 0 : y;
                const endSliceY = y + 10;

                let screenX = 0;
                for (let x = 1; x < layer[y].length; x += 10) {

                    map[screenY][screenX] = layerIndex === 0 ? [] : map[screenY][screenX];
                    const startSliceX = x === 1 ? 0 : x;
                    const endSliceX = x + 10;

                    const targetMap = layer.slice(startSliceY, endSliceY).map(chunkLine => {
                        return chunkLine.slice(startSliceX, endSliceX).map(partsNumber => {
                            return {
                                x: this.props.attribute[layerIndex][partsNumber][WWAConsts.ATR_X],
                                y: this.props.attribute[layerIndex][partsNumber][WWAConsts.ATR_Y]
                            };
                        });
                    });

                    map[screenY][screenX].push(targetMap);
                    screenX++;
                }

                screenY++;
            }
        });

        return (
            <div className={styles.mapCanvasWrapper}>
                <div
                    className={styles.mapCanvas}
                    ref={this.elementRef}
                    onMouseDown={this.handleMouseDown.bind(this)}
                    onMouseUp={this.handleMouseUp.bind(this)}
                    onMouseMove={this.handleMouseMove.bind(this)}
                >
                    {map.map((chunkLine, chunkLineIndex) => (
                        <div className={styles.mapCanvasLine} key={chunkLineIndex}>
                            {chunkLine.map((chunk, chunkColumnIndex) => {
                                return (
                                    <MapChunk
                                        key={chunkColumnIndex}
                                        map={chunk}
                                        image={this.props.image}
                                    />
                                )
                            })}
                        </div>
                    ))}
                </div>
                {this.props.selectRect !== undefined &&
                    <div
                        className={styles.selectRect}
                        style={{
                            transform: `translate(${this.props.selectRect.chipX * WWAConsts.CHIP_SIZE}px, ${this.props.selectRect.chipY * WWAConsts.CHIP_SIZE}px)`,
                            width: this.props.selectRect.chipWidth * WWAConsts.CHIP_SIZE,
                            height: this.props.selectRect.chipHeight * WWAConsts.CHIP_SIZE
                        }}
                    />
                }
            </div>
        );
    }
}

/**
 * 1画面程度の画面を描画する Canvas 要素です。
 *     プロパティ map はイメージ画像で参照される場所の座標を記載した配列になっています。
 */
class MapChunk extends React.Component<{
    map: Coord[][][],
    image: CanvasImageSource
}> {
    private canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props: MapChunk["props"]) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidUpdate() {
        this.draw();
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
