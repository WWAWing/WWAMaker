import React, { RefObject } from 'react';
import WWAConsts from '../../classes/WWAConsts';
import { LoadState } from '../../classes/Loader';

interface Props {
    state: LoadState;
    hasTransparent: boolean;
    map: number[][];
    attribute: number[][];
    mapSize: number;
    image: CanvasImageSource;
}

export default class MapLayer extends React.Component<Props, {}> {
    private canvasRef: RefObject<HTMLCanvasElement>;
    private canvasContext: CanvasRenderingContext2D | null;
    public static defaultProps: Props = {
        state: LoadState.EMPTY,
        hasTransparent: false,
        map: [],
        attribute: [],
        mapSize: WWAConsts.MAP_SIZE_DEFAULT,
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
    }

    public drawMap() {
        if (this.props.state !== LoadState.DONE) {
            return;
        }

        this.props.map.forEach((line, y) => {
            line.forEach((partsNumber, x) => {
                if (this.canvasContext === null) {
                    return;
                }
                if (this.props.hasTransparent && partsNumber === 0) {
                    return;
                }
                this.canvasContext.drawImage(
                    this.props.image,
                    this.props.attribute[partsNumber][WWAConsts.ATR_X],
                    this.props.attribute[partsNumber][WWAConsts.ATR_Y],
                    WWAConsts.CHIP_SIZE,
                    WWAConsts.CHIP_SIZE,
                    x * WWAConsts.CHIP_SIZE,
                    y * WWAConsts.CHIP_SIZE,
                    WWAConsts.CHIP_SIZE,
                    WWAConsts.CHIP_SIZE
                );
            });
        });
    }

    public render() {
        const elementSize = this.props.mapSize * WWAConsts.CHIP_SIZE;
        return (
            <canvas ref={this.canvasRef} width={elementSize} height={elementSize}></canvas>
        )
    }
}
