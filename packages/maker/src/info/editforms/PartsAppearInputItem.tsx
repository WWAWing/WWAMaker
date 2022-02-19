import React, { useState } from "react";
import { PartsType } from "../../classes/WWAData";
import { AppearPartsItem } from "./utils";
import WWAConsts from "../../classes/WWAConsts";
import { InputChangeFunctionWithIndex } from "./utils";
import { Form, Dropdown, Divider } from "semantic-ui-react";
import { CoordInput } from "./EditFormUtils";
import { BrowseParts } from "../../common/BrowseParts";
import BrowseMap from "../../common/BrowseMap";

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
    const [browseMapOpen, setBrowseMapOpen] = useState(false);

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
                        props.onChange(data.value as string, props.index + WWAConsts.REL_ATR_APPERANCE_ID)
                    }}
                >
                    <Dropdown
                        button
                        basic
                        compact
                        options={PartsTypeOptions}
                        value={type.toString()}
                        onChange={(event, data) => {
                            props.onChange(data.value as string, props.index + WWAConsts.REL_ATR_APPERANCE_TYPE);
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
                    width={11}
                    value={chipX}
                    onChange={(value) => props.onChange(value, props.index + WWAConsts.REL_ATR_APPERANCE_X)}
                />
            </Form.Group>
            <Form.Group>
                <CoordInput
                    width={11}
                    value={chipY}
                    onChange={(value) => props.onChange(value, props.index + WWAConsts.REL_ATR_APPERANCE_Y)}
                />
                <Form.Button
                    width={5}
                    onClick={() => {
                        setBrowseMapOpen(true);
                    }}
                >
                    参照
                </Form.Button>
            </Form.Group>
            <BrowseParts
                isOpen={browsePartsOpen}
                onClose={() => {
                    setBrowsePartsOpen(false);
                }}
                selectingPartsNumber={number}
                selectingPartsType={type}
                onSubmit={(partsNumber, partsType) => {
                    props.onChange(partsNumber.toString(), props.index + WWAConsts.REL_ATR_APPERANCE_ID);
                    props.onChange(partsType.toString(), props.index + WWAConsts.REL_ATR_APPERANCE_TYPE);
                }}
            />
            <BrowseMap
                isOpen={browseMapOpen}
                onClose={() => {
                    setBrowseMapOpen(false);
                }}
                onSubmit={(x, y) => {
                    props.onChange(x.value.toString(), props.index + WWAConsts.REL_ATR_APPERANCE_X);
                    props.onChange(y.value.toString(), props.index + WWAConsts.REL_ATR_APPERANCE_Y);
                }}
            />
            <Divider />
        </>
    );
}

export default PartsAppearInputItem;
