import React, { RefObject } from 'react';
import WWAConsts from '../classes/WWAConsts';
import styles from './MapCanvas.module.scss';
import MapCanvasMap, { MapLayer } from './MapChunk';
import { PartsType } from '../classes/WWAData';
import getPosEachChip from './getPosEachChip';
import { connect, MapStateToProps } from 'react-redux';
import { StoreType } from '../State';
import { Coord } from '@wwawing/common-interface';

/**
 * クリックした先のパーツ情報の1レイヤー分です。
 *     後述の MouseEventFunc で使用します。
 */
export type TargetParts = {[key in PartsType]: number};

/**
 * マウス操作を行った場合に親コンポーネントに実行されるメソッドの型です。
 *     chipX と chipY はクリックした先の座標 (マス単位) です。
 *     parts はマウス操作を行った先にあるパーツの種類とパーツ番号です。
 *     編集モードの際に対象のパーツ情報を取得する場合に使用します。
 */
export type MouseEventFunc = (chipX: number, chipY: number, parts: TargetParts) => void;

interface UserProps {
    onMouseDown: MouseEventFunc;
    onMouseMove: MouseEventFunc;
    onMouseDrag: MouseEventFunc;
    onMouseUp: MouseEventFunc;
    onContextMenu?: MouseEventFunc;
    selectRect?: SelectRectProps;
}

interface State {
    hasClick: boolean
}

interface StateProps {
    mapLayers: MapLayer[],
    mapWidth: number,
    image?: CanvasImageSource
}

const mapStateToProps: MapStateToProps<StateProps, StateProps, StoreType> = state => {
    if (state.wwaData === null || state.image === null) {
        return {
            mapLayers: [],
            mapWidth: 0
        };
    }

    const getCrops = (attribute: number[]): Coord => {
        return {
            x: attribute[WWAConsts.ATR_X],
            y: attribute[WWAConsts.ATR_Y]
        };
    };

    return {
        mapLayers: [
            {
                type: PartsType.MAP,
                fieldMap: state.wwaData.map,
                imageCrops: state.wwaData.mapAttribute.map(getCrops)
            }, {
                type: PartsType.OBJECT,
                fieldMap: state.wwaData.mapObject,
                imageCrops: state.wwaData.objectAttribute.map(getCrops)
            }
        ],
        mapWidth: state.wwaData.mapWidth,
        image: state.image
    };
};

type Props = UserProps & StateProps;

/**
 * マップを表示する Canvas です。
 */
class MapCanvas extends React.Component<Props, State> {
    private elementRef: RefObject<HTMLDivElement>;
    public static defaultProps: StateProps = {
        mapLayers: [],
        mapWidth: 0,
        image: undefined
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
        const clientRect = this.elementRef.current?.getBoundingClientRect();
        if (!clientRect) {
            return;
        }

        const [chipX, chipY] = getPosEachChip(event.clientX - clientRect.left, event.clientY - clientRect.top);
        func(chipX, chipY, {
            [PartsType.MAP]: this.getPartsNumberOnTarget(chipX, chipY, PartsType.MAP),
            [PartsType.OBJECT]: this.getPartsNumberOnTarget(chipX, chipY, PartsType.OBJECT)
        });
    }

    /**
     * 指定した座標から各パーツ種類のパーツ番号を取得します
     * @param chipX 
     * @param chipY 
     */
    private getPartsNumberOnTarget(chipX: number, chipY: number, type: PartsType): number {
        const targetLayer = this.props.mapLayers.find(layer => layer.type === type);
        if (targetLayer === undefined) {
            return 0;
        }

        return targetLayer.fieldMap[chipY][chipX];
    }

    public render() {
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
                    {this.props.image !== undefined &&
                        <MapCanvasMap
                            fieldMap={this.props.mapLayers}
                            image={this.props.image}
                            mapWidth={this.props.mapWidth}
                        />
                    }
                </div>
                {this.props.selectRect !== undefined &&
                    <SelectRect {...this.props.selectRect} />
                }
            </div>
        );
    }
}

export default connect(mapStateToProps)(MapCanvas);

export interface SelectRectProps {
    chipX: number;
    chipY: number;
    chipWidth: number;
    chipHeight: number;
};

const SelectRect: React.FC<SelectRectProps> = props => {
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
