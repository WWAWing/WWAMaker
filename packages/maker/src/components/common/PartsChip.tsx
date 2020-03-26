import React, { RefObject } from 'react';
import WWAConsts from '../../classes/WWAConsts';

interface Props {
    cropX: number,
    cropY: number,
    image: CanvasImageSource,
    isSelected: boolean,
    onClick: () => void
}

export default class PartsChip extends React.Component<Props, {}> {
    private canvasRef: RefObject<HTMLCanvasElement>;
    private canvasContext: CanvasRenderingContext2D | null;

    constructor(props: Props) {
        super(props);
        this.canvasRef = React.createRef();
        this.canvasContext = null;
    }

    public componentDidMount() {
        if (this.canvasRef.current !== null) {
            this.canvasContext = this.canvasRef.current.getContext('2d');
            this.draw();
        }
    }

    public componentDidUpdate() {
        this.draw();
    }

    private draw() {
        if (this.canvasContext === null) {
            return;
        }
        this.canvasContext.clearRect(0, 0, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE);
        this.canvasContext.drawImage(this.props.image, this.props.cropX, this.props.cropY, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE, 0, 0, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE);
        if (this.props.isSelected) {
            /**
             * @todo 定数にしたい
             */
            this.canvasContext.strokeStyle = 'rgb(255, 0, 0)';
            this.canvasContext.lineWidth = 2;
            this.canvasContext.strokeRect(1, 1, WWAConsts.CHIP_SIZE - 2, WWAConsts.CHIP_SIZE - 2);
        }
    }

    public render() {
        return (
            <canvas ref={this.canvasRef} width={WWAConsts.CHIP_SIZE} height={WWAConsts.CHIP_SIZE} onClick={this.props.onClick}></canvas>
        )
    }
}
