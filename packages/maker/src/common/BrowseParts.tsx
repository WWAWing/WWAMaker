import React from "react";
import { useState } from "react";
import { DefaultRootState, useSelector } from "react-redux";
import BrowseModal from "./BrowseModal";
import { PartsType } from "../classes/WWAData";
import PartsList from "./PartsList";

type BaseProps = {
    /** 開いているかどうか？ */
    isOpen: boolean,
    /** モーダルを閉じる際に実行されるメソッド (モーダルの開閉の状態管理は外側で行います) */
    onClose: () => void
};

type ObjectProps = BaseProps & {
    /** 選択している物体パーツ番号 */
    selectingPartsNumber: number,
    /** モーダルで「決定」を押した際に実行されるメソッド */
    onSubmit: (partsNumber: number) => void
};

type BothProps = BaseProps & {
    /** 選択しているパーツ番号 */
    selectingPartsNumber: number,
    /** 選択しているパーツ種類 */
    selectingPartsType: PartsType,
    /** モーダルで「決定」を押した際に実行されるメソッド */
    onSubmit: (partsNumber: number, partsType: PartsType) => void
};

/**
 * 物体パーツあるいは背景パーツを参照選択するモーダルです。
 */
export const BrowseParts: React.FC<BothProps> = props => {
    const ObjectPartsList = makePartsList(PartsType.OBJECT, state => state.wwaData?.objectAttribute);
    const MapPartsList = makePartsList(PartsType.MAP, state => state.wwaData?.mapAttribute);

    const [selectingPartsNumber, selectPartsNumber] = useState(0);
    const [selectingPartsType, selectPartsType] = useState<PartsType | null>(null);

    const partsTypeText = {
        [PartsType.OBJECT]: "物体",
        [PartsType.MAP]: "背景",
        "": ""
    }[selectingPartsType ?? ""];

    return (
        <BrowseModal
            isOpen={props.isOpen}
            title="パーツ番号を選択"
            onSubmit={() => {
                if (selectingPartsType === null) {
                    return;
                }
                props.onSubmit(selectingPartsNumber, selectingPartsType);
            }}
            onClose={props.onClose}
        >
            <div>
                物体
                <ObjectPartsList
                    partsNumber={props.selectingPartsType === PartsType.OBJECT ? props.selectingPartsNumber : undefined}
                    onSelect={number => {
                        selectPartsNumber(number);
                        selectPartsType(PartsType.OBJECT);
                    }}
                />
            </div>
            <div>
                背景
                <MapPartsList
                    partsNumber={props.selectingPartsType === PartsType.MAP ? props.selectingPartsNumber : undefined}
                    onSelect={number => {
                        selectPartsNumber(number);
                        selectPartsType(PartsType.MAP);
                    }}
                />
            </div>
            <div>
                {partsTypeText}パーツ {selectPartsNumber} 番
            </div>
        </BrowseModal>
    );
};

/**
 * 物体パーツを参照選択するモーダルです。
 */
export const ObjectPartsBrowse: React.FC<ObjectProps> = props => {
    const ObjectPartsList = makePartsList(PartsType.OBJECT, state => state.wwaData?.objectAttribute);
    const [objectSelectingPartsNumber, selectObjectPartsNumber] = useState(0);

    return (
        <BrowseModal
            isOpen={props.isOpen}
            title="パーツ番号を選択"
            onSubmit={() => props.onSubmit(objectSelectingPartsNumber)}
            onClose={props.onClose}
        >
            <ObjectPartsList
                partsNumber={objectSelectingPartsNumber}
                onSelect={selectObjectPartsNumber}
            />
            <div>
                物体パーツ {objectSelectingPartsNumber} 番
            </div>
        </BrowseModal>
    );
};

/**
 * パーツ一覧のコンポーネントを作成します。
 * @param type 対象のパーツ種類
 * @param selector パーツ属性情報を取り出す関数
 * @returns パーツ一覧のコンポーネント
 */
function makePartsList(type: PartsType, selector: (state: DefaultRootState) => number[][] | undefined): React.FC<{
    partsNumber?: number,
    onSelect: (partsNumber: number) => void
}> {
    return props => {
        const attributes = useSelector(selector);
        
        if (!attributes) {
            return null;
        }
        
        return (
            <PartsList
                type={type}
                attribute={attributes}
                selectPartsNumber={props.partsNumber}
                onPartsSelect={props.onSelect}
                onPartsEdit={props.onSelect}
            />
        );
    };
}
