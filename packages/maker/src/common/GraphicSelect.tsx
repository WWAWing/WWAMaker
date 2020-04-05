import React from "react";
import { Segment, Header } from "semantic-ui-react";
import drawRedRect from "./drawRedRect";
import WWAConsts from "../classes/WWAConsts";
import getPosEachChip from "./getPosEachChip";

interface Props {
    image: CanvasImageSource;
    onChange: (cropX: number, cropY: number) => void;
}

interface State {
    chipX: number;
    chipY: number;
}

/**
 * WWA パーツのグラフィックを選択するウインドウです。
 */
export class GraphicSelect extends React.Component<Props, State> {

    private canvasRef: React.RefObject<HTMLCanvasElement>;
    private canvasContext: CanvasRenderingContext2D | null;

    public static defaultProps = {
        onChange: () => {}
    };

    constructor(props: Props) {
        super(props);
        this.canvasRef = React.createRef();
        this.canvasContext = null;
        this.state = {
            chipX: 0,
            chipY: 0
        };
    }

    public componentDidMount() {
        if (this.canvasRef.current !== null) {
            this.canvasContext = this.canvasRef.current.getContext("2d");
            this.drawMap();
        }
    }

    public componentDidUpdate() {
        this.drawMap();
    }

    private handleMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
        if (this.canvasRef.current === null) {
            return;
        }
        const canvasRect = this.canvasRef.current.getBoundingClientRect();
        const [chipX, chipY] = getPosEachChip(event.clientX - canvasRect.left, event.clientY - canvasRect.top);

        this.setState({
            chipX: chipX,
            chipY: chipY
        });
    }

    private handleMouseClick(event: React.MouseEvent<HTMLCanvasElement>) {
        this.handleMouseMove(event);
        this.props.onChange(this.state.chipX, this.state.chipY);
    }

    private getElementSize(): { width: number, height: number } {
        return {
            width: this.props.image.width as number,
            height: this.props.image.height as number
        }
    }

    private drawMap() {
        if (this.canvasContext === null) {
            return;
        }

        const elementSize = this.getElementSize();
        this.canvasContext.clearRect(0, 0, elementSize.width, elementSize.height);

        this.canvasContext.drawImage(this.props.image, 0, 0);
        const currentPosX = this.state.chipX * WWAConsts.CHIP_SIZE;
        const currentPosY = this.state.chipY * WWAConsts.CHIP_SIZE;
        drawRedRect(this.canvasContext, currentPosX, currentPosY, WWAConsts.CHIP_SIZE, WWAConsts.CHIP_SIZE);
    }

    public render() {
        return　(
            <Segment>
                <Header>パーツCGの選択</Header>
                <canvas
                    ref={this.canvasRef}
                    onMouseMove={this.handleMouseMove.bind(this)}
                    onClick={this.handleMouseClick.bind(this)}
                    width={this.getElementSize().width}
                    height={this.getElementSize().height}
                ></canvas>
            </Segment>
        );
    }

}
