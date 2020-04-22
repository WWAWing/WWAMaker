import React, { RefObject } from 'react';
import WWAConsts from '../classes/WWAConsts';
import getRect from './getRect';
import drawRedRect from './drawRedRect';
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
    currentPos: {
        chipX: number,
        chipY: number
    },
    startEditMapPos: {
        chipX: number,
        chipY: number
    } | null,
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
    private canvasRef: RefObject<HTMLCanvasElement>;
    private canvasContext: CanvasRenderingContext2D | null;
    public static defaultProps: Props = {
        map: [],
        attribute: [],
        mapSize: WWAConsts.MAP_SIZE_DEFAULT,
        image: new Image(),
        currentPos: {
            chipX: 0,
            chipY: 0
        },
        startEditMapPos: null,
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
        this.canvasRef = React.createRef();
        this.canvasContext = null;
    }

    public componentDidMount() {
        if (this.canvasRef.current !== null) {
            this.canvasContext = this.canvasRef.current.getContext('2d');
            this.drawMap();
        }
    }

    public componentDidUpdate() {
        /**
         * @todo 遠くないうちに、マップまたはパーツ画像が変更されたことを検出するようにしたい。
         */
        this.drawMap();
    }

    private getElementSize() {
        return this.props.mapSize * WWAConsts.CHIP_SIZE;
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
        const canvasRect = this.canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) {
            return null;
        }

        return {
            mouseX: clientX - canvasRect.left,
            mouseY: clientY - canvasRect.top
        }
    }

    private drawMap() {
        if (this.canvasContext === null) {
            return;
        }

        this.canvasContext.fillStyle = MAP_CANVAS_BASE_COLOR;
        this.canvasContext.fillRect(0, 0, this.getElementSize(), this.getElementSize());

        this.props.map.forEach((layer, index) => {
            layer.forEach((line, y) => {
                line.forEach((partsNumber, x) => {
                    if (partsNumber === 0) {
                        return;
                    }
                    this.canvasContext?.drawImage(
                        this.props.image,
                        this.props.attribute[index][partsNumber][WWAConsts.ATR_X],
                        this.props.attribute[index][partsNumber][WWAConsts.ATR_Y],
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

        // 選択部分の描画
        const [chipX, chipY, chipWidth, chipHeight] = getRect(
            this.props.currentPos.chipX,
            this.props.currentPos.chipY,
            this.props.startEditMapPos?.chipX,
            this.props.startEditMapPos?.chipY
        );

        drawRedRect(
            this.canvasContext,
            chipX * WWAConsts.CHIP_SIZE,
            chipY * WWAConsts.CHIP_SIZE,
            (chipWidth * WWAConsts.CHIP_SIZE) + WWAConsts.CHIP_SIZE,
            (chipHeight * WWAConsts.CHIP_SIZE) + WWAConsts.CHIP_SIZE
        );
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
                <div className={styles.mapCanvas}>
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
