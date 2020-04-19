import React from "react";
import { PartsType } from "../../classes/WWAData";
import { RelativeValue } from "../../common/convertRelativeValue";
import WWAConsts from "../../classes/WWAConsts";
import { Form, Dropdown } from "semantic-ui-react";
import { CoordInput } from "./EditFormUtils";

/**
 * 指定位置にパーツを出現の各項目を表した型です。
 */
export type AppearPartsItem = { number: number, chipX: RelativeValue, chipY: RelativeValue, type: PartsType };

export type InputChangeFunctionWithIndex = (value: string, index: number) => void;

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
    mapMax: number,
    onChange: InputChangeFunctionWithIndex
}> = props => {

    const { number, chipX, chipY, type } = props.item;
    return (
        <>
            <Form.Group>
                <Form.Input
                    width={6}
                    type="number"
                    min={0}
                    max={props.partsIDMax}
                    action={(
                        <Dropdown
                            button
                            basic
                            options={PartsTypeOptions}
                            value={type.toString()}
                            onChange={(event, data) => {
                                props.onChange(data.value as string, props.index + WWAConsts.REL_ATR_APPERANCE_TYPE);
                            }}
                        />
                    )}
                    actionPosition="left"
                    value={number}
                    onChange={(event, data) => {
                        props.onChange(data.value as string, props.index + WWAConsts.REL_ATR_APPERANCE_ID)
                    }}
                />
            </Form.Group>
            <Form.Group>
                <CoordInput
                    width={12}
                    value={chipX}
                    mapWidthMax={props.mapMax}
                    onChange={(value) => props.onChange(value, props.index + WWAConsts.REL_ATR_APPERANCE_X)}
                />
                <CoordInput
                    width={12}
                    value={chipY}
                    mapWidthMax={props.mapMax}
                    onChange={(value) => props.onChange(value, props.index + WWAConsts.REL_ATR_APPERANCE_Y)}
                />
            </Form.Group>
        </>
    );
}

export default PartsAppearInputItem;
