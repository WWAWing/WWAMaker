import React, { RefObject } from 'react';
import WWAConsts from '../../classes/WWAConsts';
import styles from './index.module.scss';
import { MapLayer, FieldMapLayer, ChipLayer } from "./MapLayer";
import MapChunk from './MapChunk';
import { PartsType } from '../../classes/WWAData';
import getPosEachChip from '../getPosEachChip';
import { connect, MapStateToProps } from 'react-redux';
import { StoreType } from '../../State';
import { Coord } from '@wwawing/common-interface';

/**
 * MapChunk のサイズです。超えた分は切り捨てます。
 */
const CHUNK_SIZE = 10;

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

export interface UserProps {
    onMouseDown: MouseEventFunc;
    onMouseMove: MouseEventFunc;
    onMouseDrag: MouseEventFunc;
    onMouseUp: MouseEventFunc;
    onContextMenu?: MouseEventFunc;
}

interface State {
    hasClick: boolean
}

interface StateProps {
    fieldMap: MapLayer[],
    mapWidth: number,
    showGrid: boolean,
    image?: CanvasImageSource
}

const mapStateToProps: MapStateToProps<StateProps, StateProps, StoreType> = state => {
    if (state.wwaData === null || state.image === null) {
        return {
            fieldMap: [],
            mapWidth: 0,
            showGrid: false
        };
    }

    return {
        fieldMap: [
            new FieldMapLayer(
                PartsType.MAP,
                state.wwaData.map,
                state.wwaData.mapAttribute
            ),
            new ChipLayer(
                {
                    x: state.wwaData.playerX,
                    y: state.wwaData.playerY
                }, {
                    x: (WWAConsts.IMGPOS_DEFAULT_PLAYER_X + WWAConsts.IMGRELPOS_PLAYER_DOWN_X) * WWAConsts.CHIP_SIZE,
                    y: WWAConsts.IMGPOS_DEFAULT_PLAYER_Y * WWAConsts.CHIP_SIZE
                },
                state.wwaData.mapWidth
            ),
            new FieldMapLayer(
                PartsType.OBJECT,
                state.wwaData.mapObject,
                state.wwaData.objectAttribute
            )
        ],
        mapWidth: state.wwaData.mapWidth,
        showGrid: state.map.showGrid,
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
        fieldMap: [],
        mapWidth: 0,
        showGrid: false,
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
        const targetLayer = this.props.fieldMap.find(layer => {
            return layer instanceof FieldMapLayer && layer.getPartsType() === type
        });
        if (targetLayer === undefined) {
            return 0;
        }

        return (targetLayer as FieldMapLayer).getPartsNumber(chipX, chipY);
    }

    public shouldComponentUpdate(nextProps: Props) {
        if (this.props.mapWidth !== nextProps.mapWidth ||
            this.props.fieldMap.length !== nextProps.fieldMap.length ||
            this.props.showGrid !== nextProps.showGrid ||
            this.props.image !== nextProps.image) {
            return true;
        }

        return this.props.fieldMap.some((mapLayer, layerNumber) => {
            const nextMapLayer = nextProps.fieldMap[layerNumber];
            return mapLayer.isDifference(nextMapLayer);
        });
    }

    public render() {
        const image = this.props.image;
        if (image === undefined) {
            return null;
        }

        const chunkCount = Math.ceil(this.props.mapWidth / CHUNK_SIZE);
        /**
         * チャンクY, チャンクX, レイヤー, マスY, マスX
         */
        let chunks: Coord[][][][][] = [];
        for (let chunkY = 0; chunkY < chunkCount; chunkY++) {
            chunks[chunkY] = [];
            for (let chunkX = 0; chunkX < chunkCount; chunkX++) {
                chunks[chunkY][chunkX] = [];
            }
        }

        this.props.fieldMap.forEach(layer => {
            for (let chunkY = 0; chunkY < chunkCount; chunkY++) {
                for (let chunkX = 0; chunkX < chunkCount; chunkX++) {
                    const chunk = layer.getMapChunk(chunkX, chunkY);
                    if (chunk !== undefined) {
                        chunks[chunkY][chunkX].push(chunk);
                    }
                }
            }
        });

        return (
            <div
                className={styles.mapCanvas}
                ref={this.elementRef}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseMove={this.handleMouseMove}
                onContextMenu={this.handleContextMenu}
            >
                {chunks.map((chunkLine, chunkLineIndex) => (
                    <div className={styles.mapCanvasLine} key={chunkLineIndex}>
                        {chunkLine.map((chunk, chunkColumnIndex) => (
                            <MapChunk
                                key={chunkColumnIndex}
                                map={chunk}
                                showGrid={this.props.showGrid}
                                image={image}
                            />
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}

export default connect(mapStateToProps)(MapCanvas);
