import React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { StoreType } from '../State';
import MapView, { TargetParts, SelectRectProps } from '../common/MapView';
import { PartsType } from '../classes/WWAData';
import { Dispatch, bindActionCreators } from 'redux';
import { setCurrentPos, EditMode, setEditMode } from './MapStates';
import { putParts } from '../wwadata/WWADataState';
import getRect from '../common/getRect';
import { showPartsEdit } from '../info/InfoPanelState';
import { selectObjParts, selectMapParts } from '../parts/PartsState';

interface StateProps {
    editParts: {
        editMode: EditMode,
        objNumber: number,
        mapNumber: number
    },
    currentPos?: {
        chipX: number,
        chipY: number
    }
}

const mapStateToProps: MapStateToProps<StateProps, StateProps, StoreType> = state => {
    return {
        editParts: {
            editMode: state.map.editMode,
            objNumber: state.objParts.number,
            mapNumber: state.mapParts.number
        },
        currentPos: state.map.currentPos
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return bindActionCreators({
        setCurrentPos: setCurrentPos,
        putParts: putParts,
        showPartsEdit: showPartsEdit,
        selectObjParts: selectObjParts,
        selectMapParts: selectMapParts,
        setEditMode: setEditMode
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

class MapEdit extends React.Component<Props, State> {
    public static defaultProps: StateProps = {
        editParts: {
            editMode: EditMode.PUT_MAP,
            objNumber: 0,
            mapNumber: 0
        },
        currentPos: undefined
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            editPartsType: null,
            startEditMapPos: null
        };
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.setCurrentPos = this.setCurrentPos.bind(this);
        this.endMapEdit = this.endMapEdit.bind(this);
        this.openEdit = this.openEdit.bind(this);
    }

    private handleMouseDown(chipX: number, chipY: number, targetParts: TargetParts) {
        switch (this.props.editParts.editMode) {
            case EditMode.PUT_MAP:
            case EditMode.PUT_OBJECT:
            case EditMode.DELETE_OBJECT: {
                const partsType = getEditPartsType(this.props.editParts.editMode);
                if (partsType === null) {
                    return;
                }
                this.startMapEdit(chipX, chipY, partsType);
                break;
            }
            case EditMode.EDIT_MAP:
                this.openEdit(chipX, chipY, targetParts, PartsType.MAP);
                break;
            case EditMode.EDIT_OBJECT:
                this.openEdit(chipX, chipY, targetParts, PartsType.OBJECT);
        }
    }

    /**
     * パーツの矩形配置を開始します。
     */
    private startMapEdit(chipX: number, chipY: number, partsType: PartsType) {
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
    private endMapEdit(mouseChipX: number, mouseChipY: number) {
        if (this.state.editPartsType === null) {
            return;
        }

        const [chipX, chipY, chipWidth, chipHeight] = getRect(
            mouseChipX,
            mouseChipY,
            this.state.startEditMapPos?.chipX,
            this.state.startEditMapPos?.chipY
        );

        this.props.putParts({
            x: chipX,
            y: chipY,
            width: chipWidth,
            height: chipHeight,
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
    private setCurrentPos(chipX: number, chipY: number) {
        if (chipX === this.props.currentPos?.chipX && chipY === this.props.currentPos?.chipY) {
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

    private getSelectRect(): SelectRectProps | undefined {
        if (this.props.currentPos === undefined) {
            return undefined;
        }

        const [chipX, chipY, chipWidth, chipHeight] = getRect(
            this.props.currentPos.chipX,
            this.props.currentPos.chipY,
            this.state.startEditMapPos?.chipX,
            this.state.startEditMapPos?.chipY
        );

        return { chipX, chipY, chipWidth, chipHeight };
    }

    /**
     * 現在の座標からパーツの情報を取得し、パーツの編集画面を開きます。
     * @param type 編集中に選択しているパーツ種類 (指定がなければ物体パーツ→背景パーツ)
     */
    private openEdit(chipX: number, chipY: number, targetParts: TargetParts, type?: PartsType) {
        let targetPartsType: PartsType;
        let targetPartsNumber: number;

        // 右クリックといった、パーツ種類が明示されていない場合
        if (type === undefined) {
            
            if (targetParts[PartsType.OBJECT] !== 0) {
                targetPartsType = PartsType.OBJECT;
                targetPartsNumber = targetParts[PartsType.OBJECT];
                this.props.setEditMode({ editMode: EditMode.PUT_OBJECT });
            } else {
                targetPartsType = PartsType.MAP;
                targetPartsNumber = targetParts[PartsType.MAP];
                this.props.setEditMode({ editMode: EditMode.PUT_MAP });
            }
        } else {
            targetPartsType = type;
            switch (this.props.editParts.editMode) {
                case EditMode.EDIT_MAP:
                    targetPartsNumber = targetParts[PartsType.MAP];
                    break;
                case EditMode.EDIT_OBJECT:
                    targetPartsNumber = targetParts[PartsType.OBJECT];
                    break;
                default:
                    return;
            }
        }

        this.props.showPartsEdit({
            type: targetPartsType,
            number: targetPartsNumber
        });

        switch (targetPartsType) {
            case PartsType.OBJECT:
                this.props.selectObjParts({
                    number: targetPartsNumber
                });
                break;
            case PartsType.MAP:
                this.props.selectMapParts({
                    number: targetPartsNumber
                });
        }
    }

    public render() {
        return (
            <MapView
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.setCurrentPos}
                onMouseDrag={this.setCurrentPos}
                onMouseUp={this.endMapEdit}
                onContextMenu={this.openEdit}
                selectRect={this.getSelectRect()}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(MapEdit);
