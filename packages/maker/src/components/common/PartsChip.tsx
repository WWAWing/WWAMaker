import React, { RefObject } from 'react';
import WWAConsts from '../../classes/WWAConsts';

interface Props {
    cropX: number,
    cropY: number,
    image: CanvasImageSource,
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
        }
    }

    public componentDidUpdate() {
        if (this.canvasContext !== null) {
            this.canvasContext.drawImage(this.props.image, this.props.cropX, this.props.cropY, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE, 0, 0, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE);
        }
    }

    public render() {
        return (
            <canvas ref={this.canvasRef} width={WWAConsts.CHIP_SIZE} height={WWAConsts.CHIP_SIZE} onClick={this.props.onClick}></canvas>
        )
    }
}
