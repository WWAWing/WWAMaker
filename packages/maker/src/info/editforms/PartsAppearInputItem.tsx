import React, { useState } from "react";
import { Form, Dropdown, Divider } from "semantic-ui-react";
import WWAConsts from "../../classes/WWAConsts";
import { PartsType } from "../../classes/WWAData";
import { BrowseParts } from "../../common/BrowseParts";
import { CoordInput } from "./utils";
import { AppearPartsItem, InputChangeFunctionWithIndex } from "./utils/definitions";

/**
 * パーツ種類のドロップダウンで使用するオプション値です。
 */
const PartsTypeOptions = [
    {
        text: "物体",
        value: PartsType.OBJECT.toString()
    }, {
        text: "背景",
        value: PartsType.MAP.toString()
    }
];

/**
 * 指定位置にパーツを出現の1パーツ分の項目です。
 * @param props 
 * @todo onChange の処理内容を正しく整える
 */
const PartsAppearInputItem: React.FC<{
    item: AppearPartsItem,
    index: number,
    partsIDMax: number,
    onChange: InputChangeFunctionWithIndex
}> = props => {

    const { number, chipX, chipY, type } = props.item;
    const [browsePartsOpen, setBrowsePartsOpen] = useState(false);

    return (
        <>
            <Form.Group>
                <Form.Input
                    width={11}
                    type="number"
                    min={0}
                    max={props.partsIDMax}
                    action
                    actionPosition="left"
                    value={number}
                    onChange={(event, data) => {
                        props.onChange({
                            value: data.value as string,
                            attributeIndex: props.index + WWAConsts.REL_ATR_APPERANCE_ID
                        });
                    }}
                >
                    <Dropdown
                        button
                        basic
                        compact
                        options={PartsTypeOptions}
                        value={type.toString()}
                        onChange={(event, data) => {
                            props.onChange({
                                value: data.value as string,
                                attributeIndex: props.index + WWAConsts.REL_ATR_APPERANCE_TYPE
                            });
                        }}
                    />
                    <input />
                </Form.Input>
                <Form.Button
                    width={5}
                    onClick={() => {
                        setBrowsePartsOpen(true);
                    }}
                >
                    参照
                </Form.Button>
            </Form.Group>
            <Form.Group>
                <CoordInput
                    x={chipX}
                    y={chipY}
                    onSubmit={(x, y) => {
                        props.onChange(
                            { value: x, attributeIndex: props.index + WWAConsts.REL_ATR_APPERANCE_X },
                            { value: y, attributeIndex: props.index + WWAConsts.REL_ATR_APPERANCE_Y },
                        )
                    }}
                />
            </Form.Group>
            <BrowseParts
                isOpen={browsePartsOpen}
                onClose={() => {
                    setBrowsePartsOpen(false);
                }}
                selectingPartsNumber={number}
                selectingPartsType={type}
                onSubmit={(partsNumber, partsType) => {
                    props.onChange(
                        {
                            value: partsNumber.toString(),
                            attributeIndex: props.index + WWAConsts.REL_ATR_APPERANCE_ID
                        },
                        {
                            value: partsType.toString(),
                            attributeIndex: props.index + WWAConsts.REL_ATR_APPERANCE_TYPE
                        }
                    );
                }}
            />
            <Divider />
        </>
    );
}

export default PartsAppearInputItem;
