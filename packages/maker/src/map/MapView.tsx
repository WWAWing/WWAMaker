import React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { StoreType } from '../State';
import styles from './MapView.module.scss';
import MapCanvas from '../common/MapCanvas';
import { PartsType } from '../classes/WWAData';
import { WWAData } from "@wwawing/common-interface";
import { Dispatch, bindActionCreators } from 'redux';
import { setCurrentPos, EditMode } from './MapStates';
import { putParts } from '../wwadata/WWADataState';
import getRect from '../common/getRect';
import getPosEachChip from '../common/getPosEachChip';
import { showPartsEdit } from '../info/InfoPanelState';

interface StateProps {
    wwaData: WWAData|null;
    image: CanvasImageSource|null;
    
    editParts: {
        editMode: EditMode,
        objNumber: number,
        mapNumber: number
    },
    currentPos: {
        chipX: number,
        chipY: number
    }
}

const mapStateToProps: MapStateToProps<StateProps, StateProps, StoreType> = state => {
    return {
        wwaData: state.wwaData,
        image: state.image,
        editParts: {
            editMode: state.map.editMode,
            objNumber: state.objParts.number,
            mapNumber: state.mapParts.number
        },
        currentPos: state.map.currentPos
    };
}

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({
        setCurrentPos: setCurrentPos,
        putParts: putParts,
        showPartsEdit: showPartsEdit
    }, dispatch);
}

type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type Props = StateProps & DispatchProps;

interface State {
    /**
     * 現在編集している編集モード
     *     ドラッグ操作がない場合は null になります。
     *     予めステートとして用意することで、対応していない編集モードでのドラッグ操作を防ぐことができます。
     */
    editPartsType: PartsType | null,
    /**
     * ドラッグ操作を開始した座標 (マス単位)
     *     ドラッグ操作がない場合は null になります。
     */
    startEditMapPos: {
        chipX: number,
        chipY: number
    } | null
}

class MapView extends React.Component<Props, State> {
    public static defaultProps: StateProps = {
        wwaData: null,
        image: null,
        editParts: {
            editMode: EditMode.PUT_MAP,
            objNumber: 0,
            mapNumber: 0
        },
        currentPos: {
            chipX: 0,
            chipY: 0
        }
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            editPartsType: null,
            startEditMapPos: null
        };
    }

    private handleMouseDown(x: number, y: number) {
        switch (this.props.editParts.editMode) {
            case EditMode.PUT_MAP:
            case EditMode.PUT_OBJECT:
            case EditMode.DELETE_OBJECT: {
                const partsType = getEditPartsType(this.props.editParts.editMode);
                if (partsType === null) {
                    return;
                }
                this.startMapEdit(x, y, partsType);
                break;
            }
            case EditMode.EDIT_MAP:
            case EditMode.EDIT_OBJECT: {
                const targetParts = this.getTargetParts();
                if (targetParts === null) {
                    return;
                }
                this.props.showPartsEdit(targetParts);
            }
        }
    }

    /**
     * パーツの矩形配置を開始します。
     */
    private startMapEdit(x: number, y: number, partsType: PartsType) {

        const [chipX, chipY] = getPosEachChip(x, y);

        this.setState({
            editPartsType: partsType,
            startEditMapPos: {
                chipX: chipX,
                chipY: chipY
            }
        });
    }

    /**
     * パーツの矩形配置を終了します。
     */
    private endMapEdit(x: number, y: number) {
        if (this.state.editPartsType === null) {
            return;
        }

        const [mouseChipX, mouseChipY] = getPosEachChip(x, y);
        const [chipX, chipY, chipWidth, chipHeight] = getRect(
            mouseChipX,
            mouseChipY,
            this.state.startEditMapPos?.chipX || mouseChipX,
            this.state.startEditMapPos?.chipY || mouseChipY
        );

        this.props.putParts({
            x: chipX,
            y: chipY,
            width: chipWidth + 1,
            height: chipHeight + 1,
            partsType: this.state.editPartsType,
            partsNumber: this.getEditPartsNumber()
        });
        this.setState({
            startEditMapPos: null
        });
    }

    /**
     * マウスの位置から現在位置を設定します。
     * @param x MapCanvas の X座標 (px単位)
     * @param y MapCanvas の Y座標 (px単位)
     * @param hasClick
     */
    private setCurrentPos(x: number, y: number) {
        const [chipX, chipY] = getPosEachChip(x, y);
        if (chipX === this.props.currentPos.chipX && chipY === this.props.currentPos.chipY) {
            return;
        }

        this.props.setCurrentPos({
            chipX: chipX,
            chipY: chipY
        });
    }

    /**
     * 編集に使用するパーツ番号を取り出します。
     */
    private getEditPartsNumber(): number {
        switch (this.state.editPartsType) {
            case PartsType.OBJECT:
                if (this.props.editParts.editMode === EditMode.DELETE_OBJECT) {
                    return 0;
                }
                return this.props.editParts.objNumber;
            case PartsType.MAP:
                return this.props.editParts.mapNumber;
        }
        return 0;
    }

    /**
     * 現在の座標と編集状態からパーツの情報を取得します。
     */
    private getTargetParts(): { type: PartsType, number: number } | null {
        if (this.props.wwaData === null) {
            return null;
        }

        const { currentPos } = this.props;
        switch (this.props.editParts.editMode) {
            case EditMode.EDIT_MAP:
                return {
                    type: PartsType.MAP,
                    number: this.props.wwaData.map[currentPos.chipY][currentPos.chipX]
                }
            case EditMode.EDIT_OBJECT:
                return {
                    type: PartsType.OBJECT,
                    number: this.props.wwaData.mapObject[currentPos.chipY][currentPos.chipX]
                }
        }

        return null;
    }

    public render() {
        return (
            <div className={styles.mapView}>
                {(this.props.wwaData !== null && this.props.image !== null) &&
                    <>
                        <div className={styles.mapCanvas}>
                            <MapCanvas
                                map={[this.props.wwaData.map, this.props.wwaData.mapObject]}
                                attribute={[this.props.wwaData.mapAttribute, this.props.wwaData.objectAttribute]}
                                mapSize={this.props.wwaData.mapWidth}
                                image={this.props.image}
                                currentPos={this.props.currentPos}
                                startEditMapPos={this.state.startEditMapPos}
                                onMouseDown={this.handleMouseDown.bind(this)}
                                onMouseMove={this.setCurrentPos.bind(this)}
                                onMouseDrag={this.setCurrentPos.bind(this)}
                                onMouseUp={this.endMapEdit.bind(this)}
                            ></MapCanvas>
                        </div>
                    </>
                }
            </div>
        );
    }
}

/**
 * 編集モードから対応したパーツ種類を取得します。
 * @returns パーツ種類 (対応したものがなければ null)
 */
function getEditPartsType(editMode: EditMode): PartsType | null {
    switch(editMode) {
        case EditMode.PUT_MAP:
            return PartsType.MAP;
        case EditMode.PUT_OBJECT:
            return PartsType.OBJECT;
        case EditMode.DELETE_OBJECT:
            return PartsType.OBJECT;
    }
    return null
}

export default connect(mapStateToProps, mapDispatchToProps)(MapView);
