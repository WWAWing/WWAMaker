import React, { RefObject } from 'react';
import WWAConsts from '../classes/WWAConsts';

interface Props {
    map: number[][];
    mapObject: number[][];
    mapAttribute: number[][];
    objectAttribute: number[][];
    mapSize: number;
    image: CanvasImageSource;
}

export default class MapView extends React.Component<Props, {}> {

    private canvasRef: RefObject<HTMLCanvasElement>;
    private canvasContext: CanvasRenderingContext2D|null;
    public static defaultProps: Props = {
        map: [],
        mapObject: [],
        mapAttribute: [],
        objectAttribute: [],
        mapSize: 0,
        image: new Image()
    }

    constructor(props: Props) {
        super(props);
        this.canvasRef = React.createRef();
        this.canvasContext = null;
    }

    public componentDidMount() {
        if (this.canvasRef.current !== null) {
            this.canvasContext = this.canvasRef.current.getContext('2d');
        }
        this.drawMap();
    }

    public render() {
        const elementSize = this.props.mapSize * WWAConsts.CHIP_SIZE;
        return (
            <canvas ref={this.canvasRef} width={elementSize} height={elementSize}></canvas>
        );
    }

    public drawMap() {
        if (this.props.image === null) {
            return;
        }
        
        this.props.map.forEach((line, y) => {
            line.forEach((partsNumber, x) => {
                if (this.canvasContext === null) {
                    return;
                }
                this.canvasContext.drawImage(
                    this.props.image,
                    this.props.mapAttribute[partsNumber][WWAConsts.ATR_X],
                    this.props.mapAttribute[partsNumber][WWAConsts.ATR_Y],
                    WWAConsts.CHIP_SIZE,
                    WWAConsts.CHIP_SIZE,
                    x * WWAConsts.CHIP_SIZE,
                    y * WWAConsts.CHIP_SIZE,
                    WWAConsts.CHIP_SIZE,
                    WWAConsts.CHIP_SIZE);
            });
        });
    }
}
