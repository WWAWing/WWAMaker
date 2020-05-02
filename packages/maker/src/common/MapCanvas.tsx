import React, { RefObject, ReactNode } from 'react';
import WWAConsts from '../classes/WWAConsts';
import styles from './MapCanvas.module.scss';
import MapCanvasMap from './MapCanvasMap';

type MouseEventFunc = (x: number, y: number) => void;

interface Props {
    image?: CanvasImageSource,
    onMouseDown: (x: number, y: number) => void;
    onMouseMove: (x: number, y: number) => void;
    onMouseDrag: (x: number, y:number) => void;
    onMouseUp: (x: number, y: number) => void;
    onContextMenu?: MouseEventFunc;
    children: ReactNode;
}

interface State {
    hasClick: boolean
}

/**
 * マップを表示する Canvas です。
 */
export class MapCanvas extends React.Component<Props, State> {
    private elementRef: RefObject<HTMLDivElement>;
    public static defaultProps: Props = {
        onMouseDown: () => {},
        onMouseMove: () => {},
        onMouseDrag: () => {},
        onMouseUp: () => {},
        children: null
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            hasClick: false
        };
        this.elementRef = React.createRef();
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
    }

    private handleMouseDown(event: React.MouseEvent) {
        // 右クリックによるコンテキストメニューの表示では、クリックイベントも同時に行われるので、その場合は処置をキャンセルします。
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
        const canvasRect = this.elementRef.current?.getBoundingClientRect();
        if (!canvasRect) {
            return;
        }

        func(event.clientX - canvasRect.left, event.clientY - canvasRect.top);
    }

    public render() {
        if (this.props.image === undefined) {
            return;
        }

        return (
            <div className={styles.mapCanvasWrapper}>
                <div
                    className={styles.mapCanvas}
                    ref={this.elementRef}
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}
                    onMouseMove={this.handleMouseMove}
                    onContextMenu={this.handleContextMenu}
                >
                    <MapCanvasMap />
                </div>
                {this.props.children}
            </div>
        );
    }
}

export interface SelectRectProps {
    chipX: number;
    chipY: number;
    chipWidth: number;
    chipHeight: number;
};

export const SelectRect: React.FC<SelectRectProps> = props => {
    return (
        <div
            className={styles.selectRect}
            style={{
                transform: `translate(${props.chipX * WWAConsts.CHIP_SIZE}px, ${props.chipY * WWAConsts.CHIP_SIZE}px)`,
                width: props.chipWidth * WWAConsts.CHIP_SIZE,
                height: props.chipHeight * WWAConsts.CHIP_SIZE
            }}
        />
    )
};
