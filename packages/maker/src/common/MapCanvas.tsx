import React, { RefObject, memo } from 'react';
import { useSelector } from 'react-redux';
import WWAConsts from '../classes/WWAConsts';
import { Coord } from '@wwawing/common-interface';
import styles from './MapCanvas.module.scss';
import { StoreType } from '../State';

/**
 * 一番下に敷かれる背景色です。
 */
const MAP_CANVAS_BASE_COLOR = '#000';
/**
 * MapChunk のサイズです。一番左のチャンクは横幅1マス、一番上のチャンクは縦幅1マス増えます。
 */
const CHUNK_SIZE = 20;

type MouseEventFunc = (x: number, y: number) => void;

interface Props {
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
    onContextMenu?: MouseEventFunc;
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
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
    }

    private handleMouseDown(event: React.MouseEvent) {
        // 右クリックによるコンテキストメニューの表示では、クリックイベントも同時に行われるので、その場合は処置をキャンセルします。
        if (event.button === 2 && this.props.onContextMenu !== undefined) {
            return;
        }

        this.setState({
            hasClick: true
        });

        this.callByMousePos(event, this.props.onMouseDown);
    }

    /**
     * マウスの現在位置とクリック状態を出力し、プロパティに記載された処理を実行させます。
     */
    private handleMouseMove(event: React.MouseEvent) {
        if (this.state.hasClick) {
            this.callByMousePos(event, this.props.onMouseDrag);
        } else {
            this.callByMousePos(event, this.props.onMouseMove);
        }
    }

    private handleMouseUp(event: React.MouseEvent) {
        if (!this.state.hasClick) {
            return;
        }

        this.setState({
            hasClick: false
        });

        this.callByMousePos(event, this.props.onMouseUp);
    }

    private handleContextMenu(event: React.MouseEvent) {
        if (this.props.onContextMenu === undefined) {
            return;
        }
        event.preventDefault();

        this.callByMousePos(event, this.props.onContextMenu);
    }

    /**
     * マウスイベントから指定したメソッドを呼び出します。
     * @param event マウスイベントのメソッド
     * @param func 実行したいメソッド (主にプロパティの onMouseXX メソッドを割り当てる際に使用)
     */
    private callByMousePos(event: React.MouseEvent, func: MouseEventFunc) {
        const canvasRect = this.elementRef.current?.getBoundingClientRect();
        if (!canvasRect) {
            return;
        }

        func(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
    }

    public render() {
        const MapCanvasMapMemo = memo(MapCanvasMap);

        return (
            <div className={styles.mapCanvasWrapper}>
                <div
                    className={styles.mapCanvas}
                    ref={this.elementRef}
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}
                    onMouseMove={this.handleMouseMove}
                    onContextMenu={this.handleContextMenu}
                >
                    <MapCanvasMapMemo />
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

const MapCanvasMap: React.FC<{}> = () => {
    const fieldMap = useSelector((state: StoreType) => {
        if (state.wwaData === null) {
            return [];
        }

        return [
            {
                map: state.wwaData.map,
                attribute: state.wwaData.mapAttribute
            }, {
                map: state.wwaData.mapObject,
                attribute: state.wwaData.objectAttribute
            }
        ];
    });

    const mapWidth = useSelector((state: StoreType) => state.wwaData?.mapWidth);
    const image = useSelector((state: StoreType) => state.image);
    if (mapWidth === undefined || image === null) {
        return null;
    }

    /**
     * 1つの Canvas 要素だけでは描画しきれないため、複数のチャンクに分割し、1チャンクに MapChunk コンポーネントを渡します。
     */
    let map: Coord[][][][][] = []; // チャンクY, チャンクX, レイヤー, マスY, マスX
    fieldMap.forEach((layer, layerIndex) => {

        let screenY = 0;
        for (let y = 1; y < mapWidth; y += CHUNK_SIZE) {

            map[screenY] = layerIndex === 0 ? [] : map[screenY];
            const startSliceY = y === 1 ? 0 : y;
            const endSliceY = y + CHUNK_SIZE;

            let screenX = 0;
            for (let x = 1; x < mapWidth; x += CHUNK_SIZE) {

                map[screenY][screenX] = layerIndex === 0 ? [] : map[screenY][screenX];
                const startSliceX = x === 1 ? 0 : x;
                const endSliceX = x + CHUNK_SIZE;

                const targetMap = layer.map.slice(startSliceY, endSliceY).map(chunkLine => {
                    return chunkLine.slice(startSliceX, endSliceX).map(partsNumber => {
                        return {
                            x: layer.attribute[partsNumber][WWAConsts.ATR_X],
                            y: layer.attribute[partsNumber][WWAConsts.ATR_Y]
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
        <>
            {map.map((chunkLine, chunkLineIndex) => (
                <div className={styles.mapCanvasLine} key={chunkLineIndex}>
                    {chunkLine.map((chunk, chunkColumnIndex) => (
                        <MapChunk
                            key={chunkColumnIndex}
                            map={chunk}
                            image={image}
                        />
                    ))}
                </div>
            ))}
        </>
    );
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
