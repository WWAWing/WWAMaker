import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MapView, { TargetParts, SelectRectProps } from '../common/MapView';
import { PartsType } from '../classes/WWAData';
import { setCurrentPos, EditMode, setEditMode } from './MapStates';
import { putParts } from '../wwadata/WWADataState';
import getRect from '../common/getRect';
import checkPartsEdit from '../info/checkPartsEdit';
import { showPartsEdit } from '../info/InfoPanelState';
import { selectMapParts, selectObjectParts } from '../parts/PartsState';

const MapEdit: React.FC = () => {

    /**
     * 現在編集している編集モード
     *     ドラッグ操作がない場合は null になります。
     *     予めステートとして用意することで、対応していない編集モードでのドラッグ操作を防ぐことができます。
     */
    const [editPartsType, setEditPartsType] = useState<PartsType | null>(null);
    /**
     * ドラッグ操作を開始した座標 (マス単位)
     *     ドラッグ操作がない場合は null になります。
     */
    const [startEditMapPos, startEditingMapPos] = useState<{
        chipX: number,
        chipY: number
    } | null>(null);

    const editMode = useSelector(state => state.map.editMode);
    const objNumber = useSelector(state => state.objParts.number);
    const mapNumber = useSelector(state => state.mapParts.number);
    const currentPos = useSelector(state => state.map.currentPos);

    const dispatch = useDispatch();

    const handleMouseDown = (chipX: number, chipY: number, targetParts: TargetParts) => {
        switch (editMode) {
            case EditMode.PUT_MAP:
            case EditMode.PUT_OBJECT:
            case EditMode.DELETE_OBJECT: {
                const partsType = getEditPartsType(editMode);
                if (partsType === null) {
                    return;
                }
                startMapEdit(chipX, chipY, partsType);
                break;
            }
            case EditMode.EDIT_MAP:
                openEdit(chipX, chipY, targetParts, PartsType.MAP);
                break;
            case EditMode.EDIT_OBJECT:
                openEdit(chipX, chipY, targetParts, PartsType.OBJECT);
        }
    };

    /**
     * パーツの矩形配置を開始します。
     */
    const startMapEdit = (chipX: number, chipY: number, partsType: PartsType) => {
        setEditPartsType(partsType);
        startEditingMapPos({
            chipX,
            chipY
        });
    };

    /**
     * パーツの矩形配置を終了します。
     */
    const endMapEdit = (mouseChipX: number, mouseChipY: number) => {
        if (editPartsType === null) {
            return;
        }

        const [chipX, chipY, chipWidth, chipHeight] = getRect(
            mouseChipX,
            mouseChipY,
            startEditMapPos?.chipX,
            startEditMapPos?.chipY
        );

        dispatch(putParts({
            x: chipX,
            y: chipY,
            width: chipWidth,
            height: chipHeight,
            partsType: editPartsType,
            partsNumber: getEditPartsNumber()
        }));
        startEditingMapPos(null);
    }

    /**
     * マウスの位置から現在位置を設定します。
     * @param x MapCanvas の X座標 (px単位)
     * @param y MapCanvas の Y座標 (px単位)
     * @param hasClick
     */
    const updateCurrentPos = (chipX: number, chipY: number) => {
        if (chipX === currentPos?.chipX && chipY === currentPos?.chipY) {
            return;
        }

        dispatch(setCurrentPos({
            chipX: chipX,
            chipY: chipY
        }));
    }

    /**
     * 編集に使用するパーツ番号を取り出します。
     */
    const getEditPartsNumber: () => number = () => {
        switch (editPartsType) {
            case PartsType.OBJECT:
                if (editMode === EditMode.DELETE_OBJECT) {
                    return 0;
                }
                return objNumber;
            case PartsType.MAP:
                return mapNumber;
        }
        return 0;
    }

    const getSelectRect: () => SelectRectProps | undefined = () => {
        if (currentPos === undefined) {
            return undefined;
        }

        const [chipX, chipY, chipWidth, chipHeight] = getRect(
            currentPos.chipX,
            currentPos.chipY,
            startEditMapPos?.chipX,
            startEditMapPos?.chipY
        );

        return { chipX, chipY, chipWidth, chipHeight };
    }

    /**
     * 現在の座標からパーツの情報を取得し、パーツの編集画面を開きます。
     * @param type 編集中に選択しているパーツ種類 (指定がなければ物体パーツ→背景パーツ)
     */
    const openEdit = (chipX: number, chipY: number, targetParts: TargetParts, type?: PartsType) => {
        let targetPartsType: PartsType;
        let targetPartsNumber: number;

        // 右クリックといった、パーツ種類が明示されていない場合
        if (type === undefined) {
            
            if (targetParts[PartsType.OBJECT] !== 0) {
                targetPartsType = PartsType.OBJECT;
                targetPartsNumber = targetParts[PartsType.OBJECT];
                dispatch(setEditMode(EditMode.PUT_OBJECT));
            } else {
                targetPartsType = PartsType.MAP;
                targetPartsNumber = targetParts[PartsType.MAP];
                dispatch(setEditMode(EditMode.PUT_MAP));
            }
        } else {
            targetPartsType = type;
            switch (editMode) {
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

        checkPartsEdit(targetPartsType, targetPartsNumber, () => {
            dispatch(showPartsEdit({
                type: targetPartsType,
                number: targetPartsNumber
            }));
            switch (targetPartsType) {
                case PartsType.OBJECT:
                    dispatch(selectObjectParts(targetPartsNumber));
                    break;
                case PartsType.MAP:
                    dispatch(selectMapParts(targetPartsNumber));
            }
        });

    }

    return (
        <MapView
            onMouseDown={handleMouseDown}
            onMouseMove={updateCurrentPos}
            onMouseDrag={updateCurrentPos}
            onMouseUp={endMapEdit}
            onContextMenu={openEdit}
            selectRect={getSelectRect()}
        />
    );
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

export default MapEdit;
