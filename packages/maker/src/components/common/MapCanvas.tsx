import React, { RefObject } from 'react';
import WWAConsts from '../../classes/WWAConsts';

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
        x: number,
        y: number
    }
    onMouseMove: (x: number, y: number) => void;
}

/**
 * マップを表示する Canvas です。
 */
export default class MapCanvas extends React.Component<Props, {}> {
    private canvasRef: RefObject<HTMLCanvasElement>;
    private canvasContext: CanvasRenderingContext2D | null;
    public static defaultProps: Props = {
        map: [],
        attribute: [],
        mapSize: WWAConsts.MAP_SIZE_DEFAULT,
        image: new Image(),
        currentPos: {
            x: 0,
            y: 0
        },
        onMouseMove: () => {}
    }

    constructor(props: Props) {
        super(props);
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

    /**
     * 現在のマウスの位置を出力します。
     * @param event 
     */
    private getCurrentPos(event: React.MouseEvent): [number, number] {
        const canvasRect = this.canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) {
            return [0, 0];
        }

        return [event.clientX - canvasRect.left, event.clientY - canvasRect.top];
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

        this.renderCurrentPos();

    }
    
    private renderCurrentPos() {
        const mouseX = this.props.currentPos.x * WWAConsts.CHIP_SIZE;
        const mouseY = this.props.currentPos.y * WWAConsts.CHIP_SIZE;
        this.canvasContext?.strokeRect(mouseX, mouseY, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE);
    }

    public render() {
        const elementSize = this.props.mapSize * WWAConsts.CHIP_SIZE;
        return (
            <canvas
                ref={this.canvasRef}
                onMouseMove={(event) => this.props.onMouseMove(...this.getCurrentPos(event))}
                width={elementSize}
                height={elementSize}
            ></canvas>
        )
    }
}
