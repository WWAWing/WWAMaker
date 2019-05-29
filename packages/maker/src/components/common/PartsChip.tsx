import React, { RefObject } from 'react';
import WWAConsts from '../../classes/WWAConsts';

interface Props {
    cropX: number,
    cropY: number,
    image: CanvasImageSource
}

interface State {
    isSelected: boolean;
}

export default class PartsChip extends React.Component<Props, State> {
    private canvasRef: RefObject<HTMLCanvasElement>;
    private canvasContext: CanvasRenderingContext2D | null;

    constructor(props: Props) {
        super(props);
        this.canvasRef = React.createRef();
        this.canvasContext = null;
        this.state = {
            isSelected: false
        }
    }

    /**
     * 選択状態を切り替えます。
     * @todo PartsList 上で実行出来る状態にして、どのパーツを選択しているかを Maker 全体で共有したい。
     */
    public toggleSelect() {
        this.setState(state => ({
            isSelected: !state.isSelected
        }));
    }

    public componentDidMount() {
        if (this.canvasRef.current !== null) {
            this.canvasContext = this.canvasRef.current.getContext('2d');
        }
    }

    public componentDidUpdate() {
        if (this.canvasContext !== null) {
            this.canvasContext.drawImage(this.props.image, this.props.cropX, this.props.cropY, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE, 0, 0, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE);
            if (this.state.isSelected) {
                /**
                 * @todo 定数にしたい
                 */
                this.canvasContext.strokeStyle = 'rgb(255, 0, 0)';
                this.canvasContext.lineWidth = 2;
                this.canvasContext.strokeRect(1, 1, WWAConsts.CHIP_SIZE - 2, WWAConsts.CHIP_SIZE - 2);
            }
        }
    }

    public render() {
        return (
            <canvas ref={this.canvasRef} width={WWAConsts.CHIP_SIZE} height={WWAConsts.CHIP_SIZE} onClick={this.toggleSelect.bind(this)}></canvas>
        )
    }
}
