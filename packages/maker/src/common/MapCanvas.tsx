import React, { RefObject } from 'react';
import WWAConsts from '../classes/WWAConsts';
import getRect from './getRect';
import drawRedRect from './drawRedRect';

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
    onContextMenu?: (x: number, y: number) => void;
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
        if (event.button === 2 && this.props.onContextMenu !== undefined) {
            return;
        }

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

    private handleContextMenu(event: React.MouseEvent) {
        if (this.props.onContextMenu === undefined) {
            return;
        }
        event.preventDefault();

        const mousePos = this.getMousePos(event.clientX, event.clientY);
        if (!mousePos) {
            return;
        }

        this.props.onContextMenu(mousePos.mouseX, mousePos.mouseY);
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
