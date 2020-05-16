import { useSelector, useDispatch } from "react-redux";
import { InfoPanelPartsEditState, switchInfoPanel } from "./InfoPanelState";
import { editParts } from "../wwadata/WWADataState";
import React, { useState, useRef, useEffect } from "react";
import { PartsType, createEmptyPartsAttribute } from "../classes/WWAData";
import WWAConsts from "../classes/WWAConsts";
import { ObjectEditTable } from "./editforms/ObjectEditForm";
import { MapEditTable } from "./editforms/MapEditForm";
import { PartsEditAttributeChange, PartsEditMessageChange } from "./editforms/PartsEditComponent";
import { Form, Portal, Button, Icon, Dropdown, DropdownItemProps } from "semantic-ui-react";
import PartsChip from "../common/PartsChip";
import { GraphicSelect } from "../common/GraphicSelect";
import getPartsCountPerIncreaseUnit from "../common/getPartsCountPerIncreaseUnit";
import { useImage } from "wwamaker-image-decorder";

type PartsEditState = {
    /**
     * partsEdit は Redux の info.partsEdit と同じ内容が含まれています。
     *     ステートに含ませているのは、編集しているパーツの情報とそのパーツの属性やメッセージの不一致による副作用を防ぐためです。
     * @see InfoPanelPartsEditState
     */
    partsEdit: InfoPanelPartsEditState,
    attribute: number[],
    message: string
} | null;

type GraphicSelectState = "NONE" | "1" | "2";

/**
 * パーツ編集の管理を行う Container コンポーネントです。
 *     編集フォームは、パーツ種別毎に用意した専用のコンポーネントを取り出して表示されます。
 */
const PartsEdit: React.FC = () => {
    const dispatch = useDispatch();

    /**
     * パーツCGの選択画面を表示する場所を決める要素の Ref です。
     *     Semantic UI React の Portal では、切り替えで表示される要素は原則HTMLのルートに配置されます。
     *     ルートで配置された場合、 WWA Maker としては都合が良くないため、編集画面の決まった位置で表示されるように Ref を設けて、その Ref に対してマウントするようにしています。
     */
    const graphicSelectMount = useRef<HTMLDivElement>(null);
    const [graphicSelect, setGraphicSelect] = useState<GraphicSelectState>("NONE");

    const currentPartsInfo: InfoPanelPartsEditState | null = useSelector(state => state.info.partsEdit) ?? null;
    const objectAttribute = useSelector(state => state.wwaData?.objectAttribute);
    const mapAttribute = useSelector(state => state.wwaData?.mapAttribute);
    const messages = useSelector(state => state.wwaData?.message);

    const imageUrl = useSelector(state => state.imageUrl);
    const image = useImage(imageUrl ?? "");
    const objPartsMax = useSelector(state => state.wwaData?.objPartsMax) ?? 0;
    const mapPartsMax = useSelector(state => state.wwaData?.mapPartsMax) ?? 0;


    /**
     * 現在編集しているパーツ情報です。
     */
    const [editingParts, updatePartsEdit] = useState<PartsEditState>(null);


    const handleSubmit = () => {
        if (editingParts === null) {
            return;
        }

        dispatch(editParts({
            ...editingParts.partsEdit,
            attributes: editingParts.attribute,
            message: editingParts.message
        }));
    };

    const showGraphicSelect = (type: GraphicSelectState) => {
        setGraphicSelect(type);
    };

    /**
     * パーツCGの選択画面を閉じます。
     */
    const closeGraphicSelect = () => {
        setGraphicSelect("NONE");
    };

    /**
     * パーツのグラフィック画像を変更し、ステートに反映します。
     */
    const setPartsGraphic = (chipX: number, chipY: number, type: GraphicSelectState) => {
        if (editingParts === null || type === "NONE") {
            return;
        }

        let newAttribute = editingParts.attribute.slice();
        switch (type) {
            case "1":
                newAttribute[WWAConsts.ATR_X] = chipX * WWAConsts.CHIP_SIZE;
                newAttribute[WWAConsts.ATR_Y] = chipY * WWAConsts.CHIP_SIZE;
                break;
            case "2":
                newAttribute[WWAConsts.ATR_X2] = chipX * WWAConsts.CHIP_SIZE;
                newAttribute[WWAConsts.ATR_Y2] = chipY * WWAConsts.CHIP_SIZE;
                break;
        }

        updatePartsEdit({
            ...editingParts,
            attribute: newAttribute
        });
        closeGraphicSelect();
    };

    /**
     * @see PartsEditAttributeChange
     */
    const handleAttributeChange: PartsEditAttributeChange = (value, attributeIndex) => {
        if (editingParts === null) {
            return;
        }

        let newAttribute = editingParts.attribute.slice();
        const parsedValue = parseInt(value);
        newAttribute[attributeIndex] = Number.isNaN(parsedValue) ? 0 : parsedValue;

        updatePartsEdit({
            ...editingParts,
            attribute: newAttribute
        });
    };

    /**
     * @see PartsEditMessageChange
     */
    const handleMessageChange: PartsEditMessageChange = value => {
        if (editingParts === null) {
            return;
        }
        
        updatePartsEdit({
            ...editingParts,
            message: value
        });
    };

    const handleEditButtonClick = () => {
        handleSubmit();
        dispatch(switchInfoPanel({ mode: "GENERAL" }));
    };

    const handleCancelButtonClick = () => {
        dispatch(switchInfoPanel({ mode: "GENERAL" }));
    };

    /**
     * パーツ種別対応表の変数を取得します。
     */
    const getPartsEditTable = () => {
        if (editingParts === undefined) {
            return null;
        }
        switch (editingParts?.partsEdit.type) {
            case PartsType.MAP:
                return MapEditTable;
            case PartsType.OBJECT:
                return ObjectEditTable;
        }

        return null;
    };

    /**
     * パーツ種別を変更するセレクトボックスを出力します。
     */
    const renderPartsSelectBox = () => {
        const partsEditTable = getPartsEditTable();
        if (!partsEditTable || editingParts === null) {
            return;
        }
        
        const partsEditType = editingParts.attribute[WWAConsts.ATR_TYPE];
        const partsEditOptions: DropdownItemProps[] = partsEditTable.map(partsEdit => ({
            text: partsEdit.name,
            value: partsEdit.id
        }));
        return (
            <Dropdown
                button
                basic
                options={partsEditOptions}
                onChange={(event, data) => {
                    handleAttributeChange(data.value as string, WWAConsts.ATR_TYPE);
                }}
                value={partsEditType}
            />
        );
    };

    /**
     * パーツCGの選択部分を出力します。
     */
    const renderPartsGraphic = (type: GraphicSelectState, attributeIndexX: number, attributeIndexY: number) => {
        if (editingParts === null || image === null) {
            return;
        }

        const attribute = editingParts.attribute;
        return (
            <Portal
                trigger={
                    <PartsChip
                        cropX={attribute[attributeIndexX]}
                        cropY={attribute[attributeIndexY]}
                        image={image}
                        isSelected={false}
                        onClick={() => {}}
                    />
                }
                open={graphicSelect === type}
                onOpen={() => showGraphicSelect(type)}
                onClose={() => closeGraphicSelect()}
                mountNode={graphicSelectMount?.current}
            >
                <GraphicSelect
                    image={image}
                    onChange={(chipX, chipY) => setPartsGraphic(chipX, chipY, type)}
                />
            </Portal>
        );
    };

    const renderPartsGraphics = () => {
        if (editingParts === null) {
            return null;
        }

        return (
            <>
                {renderPartsGraphic("1", WWAConsts.ATR_X, WWAConsts.ATR_Y)}

                {editingParts.partsEdit.type === PartsType.OBJECT &&
                    renderPartsGraphic("2", WWAConsts.ATR_X2, WWAConsts.ATR_Y2)
                }

                <div ref={graphicSelectMount}></div>
            </>
        );
    };

    /**
     * 編集フォームを出力します。
     */
    const renderEditForm = () => {
        if (editingParts === null) {
            return <p>WWAデータがありません。マップデータを開いてください。</p>;
        }

        const partsEditTable = getPartsEditTable();
        if (!partsEditTable) {
            return null;
        }

        const attribute = editingParts.attribute;
        const message = editingParts.message;
        const typeNumber = attribute[WWAConsts.ATR_TYPE];

        const partsEditItem = partsEditTable.find(item => item.id === typeNumber);
        if (partsEditItem === undefined) {
            throw new Error(`パーツ種別 ${typeNumber} 番に対応するパーツ種別が見つかりませんでした。`);
        }

        const PartsEditComponent = partsEditItem.component;
        const PartsAppearEditComponent = partsEditItem.partsAppear;

        return (
            <>
                <PartsEditComponent
                    attribute={attribute}
                    message={message}
                    onAttributeChange={handleAttributeChange}
                    onMessageChange={handleMessageChange}
                />
                {PartsAppearEditComponent !== undefined &&
                    <PartsAppearEditComponent
                        attribute={attribute}
                        onChange={handleAttributeChange}
                        partsMax={{
                            [PartsType.OBJECT]: getPartsCountPerIncreaseUnit(objPartsMax),
                            [PartsType.MAP]: getPartsCountPerIncreaseUnit(mapPartsMax)
                        }}
                    />
                }
            </>
        );
    };


    useEffect(() => {
        if (currentPartsInfo === null ||
            objectAttribute === undefined ||
            mapAttribute === undefined ||
            messages === undefined) {
            return;
        }

        const attribute = (() => {
            switch (currentPartsInfo?.type) {
                case PartsType.OBJECT:
                    return objectAttribute[currentPartsInfo.number];
                case PartsType.MAP:
                    return mapAttribute[currentPartsInfo.number];
            }
        })() ?? createEmptyPartsAttribute(currentPartsInfo.type);

        const message = messages[attribute[WWAConsts.ATR_STRING]];

        updatePartsEdit({
            partsEdit: currentPartsInfo,
            attribute,
            message
        });
    }, [currentPartsInfo, objectAttribute, mapAttribute, messages]);

    return (
        <Form>
            {renderPartsSelectBox()}
            {renderPartsGraphics()}
            {renderEditForm()}
            <Form.Field>
                <Button primary onClick={handleEditButtonClick}>
                    <Icon name="check" />
                    決定
                </Button>
                <Button onClick={handleCancelButtonClick}>
                    <Icon name="cancel" />
                    取り消し
                </Button>
            </Form.Field>
        </Form>
    );
};

export default PartsEdit;
