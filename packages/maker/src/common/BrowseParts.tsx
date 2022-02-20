import React, { useEffect } from "react";
import { useState } from "react";
import { DefaultRootState, useSelector } from "react-redux";
import { Label, Message } from "semantic-ui-react";
import BrowseModal from "./BrowseModal";
import { PartsType } from "../classes/WWAData";
import PartsList from "./PartsList";
import WWAConsts from "../classes/WWAConsts";

/**
 * パーツ一覧のコンポーネントを作成します。
 * @param type 対象のパーツ種類
 * @param selector パーツ属性情報を取り出す関数
 * @returns パーツ一覧のコンポーネント
 */
 function makePartsList(type: PartsType, selector: (state: DefaultRootState) => number[][] | undefined): React.FC<{
    partsNumber?: number,
    onSelect: (partsNumber: number, partsAttributes: number[]) => void
}> {
    return props => {
        const attributes = useSelector(selector);
        
        if (!attributes) {
            return null;
        }
        
        return (
            <div style={{ height: "30vh" }}>
                <PartsList
                    type={type}
                    attribute={attributes}
                    selectPartsNumber={props.partsNumber}
                    onPartsSelect={(partsNumber) => {
                        props.onSelect(partsNumber, attributes[partsNumber]);
                    }}
                    onPartsEdit={(partsNumber) => {
                        props.onSelect(partsNumber, attributes[partsNumber]);
                    }}
                />
            </div>
        );
    };
}

const ObjectPartsList = makePartsList(PartsType.OBJECT, state => state.wwaData?.objectAttribute);
const MapPartsList = makePartsList(PartsType.MAP, state => state.wwaData?.mapAttribute);

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
    const [selectingPartsNumber, selectPartsNumber] = useState(props.selectingPartsNumber);
    const [selectingPartsType, selectPartsType] = useState<PartsType | null>(props.selectingPartsType);

    const partsTypeText = {
        [PartsType.OBJECT]: "物体",
        [PartsType.MAP]: "背景",
        "": ""
    }[selectingPartsType ?? ""];

    useEffect(() => {
        // モーダルが開いた場合は同期する
        if (props.isOpen) {
            selectPartsNumber(props.selectingPartsNumber);
            selectPartsType(props.selectingPartsType);
        }
    // eslint-disable-next-line
    }, [props.isOpen]);

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
                    partsNumber={selectingPartsType === PartsType.OBJECT ? selectingPartsNumber : undefined}
                    onSelect={number => {
                        selectPartsNumber(number);
                        selectPartsType(PartsType.OBJECT);
                    }}
                />
            </div>
            <div>
                背景
                <MapPartsList
                    partsNumber={selectingPartsType === PartsType.MAP ? selectingPartsNumber : undefined}
                    onSelect={number => {
                        selectPartsNumber(number);
                        selectPartsType(PartsType.MAP);
                    }}
                />
            </div>
            <div>
                {partsTypeText}パーツ {selectingPartsNumber} 番
            </div>
        </BrowseModal>
    );
};

/**
 * 物体パーツを参照選択するモーダルです。
 */
export const ObjectPartsBrowse: React.FC<ObjectProps> = props => {
    const [objectSelectingPartsNumber, selectObjectPartsNumber] = useState(props.selectingPartsNumber);

    useEffect(() => {
        if (props.isOpen) {
            selectObjectPartsNumber(props.selectingPartsNumber);
        }
    // eslint-disable-next-line
    }, [props.isOpen]);

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
            <Label>
                物体パーツ
                <Label.Detail>{objectSelectingPartsNumber} 番</Label.Detail>
            </Label>
        </BrowseModal>
    );
};

/**
 * アイテムを参照選択するモーダルです。
 * 機能は物体パーツのものと同じですが、アイテム以外を選択するとアラートが表示されます。
 */
export const ItemPartsBrowse: React.FC<ObjectProps> = props => {
    const [objectSelectingPartsNumber, selectObjectPartsNumber] = useState(props.selectingPartsNumber);
    const [isItem, setIsItem] = useState<boolean | null>(null);

    useEffect(() => {
        if (props.isOpen) {
            selectObjectPartsNumber(props.selectingPartsNumber);
        }
    // eslint-disable-next-line
    }, [props.isOpen]);

    return (
        <BrowseModal
            isOpen={props.isOpen}
            title="アイテムパーツ番号を選択"
            onSubmit={() => props.onSubmit(objectSelectingPartsNumber)}
            onClose={props.onClose}
        >
            <ObjectPartsList
                partsNumber={objectSelectingPartsNumber}
                onSelect={(partsNumber, partsAttributes) => {
                    selectObjectPartsNumber(partsNumber);
                    setIsItem(partsAttributes[WWAConsts.ATR_TYPE] === WWAConsts.OBJECT_ITEM);
                }}
            />
            <Label>
                物体パーツ
                <Label.Detail>{objectSelectingPartsNumber} 番</Label.Detail>
            </Label>
            {objectSelectingPartsNumber !== 0 && isItem === false &&
                <Message warning>
                    <Message.Header>ステータス変化パーツなどのアイテム以外のパーツが指定されています</Message.Header>
                    <p>後に設定する場合は、忘れずにパーツを編集しておきましょう。</p>
                </Message>
            }
        </BrowseModal>
    );
};
