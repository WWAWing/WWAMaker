import React, { RefObject } from 'react';
import WWAConsts from '../classes/WWAConsts';
import getRect from './getRect';
import drawRedRect from './drawRedRect';

/**
 * 一番下に敷かれる背景色です。
 */
const MAP_CANVAS_BASE_COLOR = '#000';

type MouseEventFunc = (x: number, y: number) => void;

interface Props {
    map: number[][][];
    attribute: number[][][];
    mapSize: number;
    image: CanvasImageSource;
    currentPos: {
        chipX: number,
        chipY: number
    };
    startEditMapPos: {
        chipX: number,
        chipY: number
    } | null;
    onMouseDown: MouseEventFunc;
    onMouseMove: MouseEventFunc;
    onMouseDrag: MouseEventFunc;
    onMouseUp: MouseEventFunc;
    onContextMenu?: MouseEventFunc;
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
        // 右クリックによるコンテキストメニューの表示では、クリックイベントも同時に行われるので、その場合は処置をキャンセルします。
        console.log(event.button, this.props.onContextMenu);
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
        const canvasRect = this.canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) {
            return;
        }

        func(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
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
        const elementSize = this.props.mapSize * WWAConsts.CHIP_SIZE;
        return (
            <canvas
                ref={this.canvasRef}
                onMouseDown={this.handleMouseDown.bind(this)}
                onMouseMove={this.handleMouseMove.bind(this)}
                onMouseUp={this.handleMouseUp.bind(this)}
                onContextMenu={this.handleContextMenu.bind(this)}
                width={elementSize}
                height={elementSize}
            ></canvas>
        )
    }
}
