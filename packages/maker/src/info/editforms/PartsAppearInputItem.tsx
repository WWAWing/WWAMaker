import React from "react";
import { PartsType } from "../../classes/WWAData";
import { AppearPartsItem } from "./utils";
import WWAConsts from "../../classes/WWAConsts";
import { InputChangeFunctionWithIndex } from "./utils";
import { Form, Dropdown } from "semantic-ui-react";
import { CoordInput } from "./EditFormUtils";

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
 * @todo 参照ボタンを実装する
 */
const PartsAppearInputItem: React.FC<{
    item: AppearPartsItem,
    index: number,
    partsIDMax: number,
    onChange: InputChangeFunctionWithIndex
}> = props => {

    const { number, chipX, chipY, type } = props.item;
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
                        options={PartsTypeOptions}
                        value={type.toString()}
                        onChange={(event, data) => {
                            props.onChange(data.value as string, props.index + WWAConsts.REL_ATR_APPERANCE_TYPE);
                        }}
                    />
                    <input />
                </Form.Input>
                <Form.Button width={5}>参照</Form.Button>
            </Form.Group>
            <Form.Group>
                <CoordInput
                    width={12}
                    value={chipX}
                    onChange={(value) => props.onChange(value, props.index + WWAConsts.REL_ATR_APPERANCE_X)}
                />
                <CoordInput
                    width={12}
                    value={chipY}
                    onChange={(value) => props.onChange(value, props.index + WWAConsts.REL_ATR_APPERANCE_Y)}
                />
            </Form.Group>
        </>
    );
}

export default PartsAppearInputItem;
