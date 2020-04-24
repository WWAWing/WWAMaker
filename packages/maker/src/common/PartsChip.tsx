import React, { RefObject } from 'react';
import WWAConsts from '../classes/WWAConsts';
import drawRedRect from './drawRedRect';

interface Props {
    cropX: number,
    cropY: number,
    image: CanvasImageSource,
    isSelected: boolean,
    onClick?: (event: React.MouseEvent<HTMLCanvasElement>) => void,
    onDoubleClick?: (event: React.MouseEvent<HTMLCanvasElement>) => void,
    onContextMenu?: (event: React.MouseEvent<HTMLCanvasElement>) => void
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

    public shouldComponentUpdate(prevProps: Props) {
        return prevProps.cropX !== this.props.cropX
            || prevProps.cropY !== this.props.cropY
            || prevProps.isSelected !== this.props.isSelected;
    }

    private handleContextMenu(event: React.MouseEvent<HTMLCanvasElement>) {
        if (this.props.onContextMenu === undefined) {
            return;
        }
        event.preventDefault();
        this.props.onContextMenu(event);
    }

    private draw() {
        if (this.canvasContext === null) {
            return;
        }
        this.canvasContext.clearRect(0, 0, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE);
        this.canvasContext.drawImage(this.props.image, this.props.cropX, this.props.cropY, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE, 0, 0, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE);
        if (this.props.isSelected) {
            drawRedRect(this.canvasContext, 0, 0, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE);
        }
    }

    public render() {
        // 原作の作成ツールではマウスボタンを押したタイミングで反応するため、その形に従うようにしている
        return (
            <canvas
                ref={this.canvasRef}
                width={WWAConsts.CHIP_SIZE}
                height={WWAConsts.CHIP_SIZE}
                onMouseDown={this.props.onClick}
                onDoubleClick={this.props.onDoubleClick}
                onContextMenu={this.handleContextMenu.bind(this)}
            />
        )
    }
}
