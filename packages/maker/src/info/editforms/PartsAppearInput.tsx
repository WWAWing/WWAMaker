import React, { useState } from "react";
import { PartsType, PartsAttributeItems } from "../../classes/WWAData";
import { Accordion, Form, Icon, Button } from "semantic-ui-react";
import WWAConsts from "../../classes/WWAConsts";
import { RelativeValue, convertRelativeValueFromCoord } from "../../common/convertRelativeValue";
import { CoordInput } from "./EditFormUtils";

// 指定位置にパーツを出現 関係のコンポーネントをまとめたファイルです。

/**
 * 指定位置にパーツを出現の各項目を表した型です。
 */
type AppearPartsItem = { number: number, chipX: RelativeValue, chipY: RelativeValue, type: PartsType };

type InputChangeFunctionWithIndex = (value: string, index: number) => void;

/**
 * 指定位置にパーツを出現の入力フォームです。
 * @todo onChange の処理内容を正しく整える
 */
export const PartsApperarInput: React.FunctionComponent<{
    items: AppearPartsItem[],
    onChange: InputChangeFunctionWithIndex
}> = props => {
    const [isOpen, setOpen] = useState(false);

    return (
        <Accordion>
            <Accordion.Title active={isOpen} onClick={() => setOpen(!isOpen)}>
                <Icon name="dropdown" />
                指定位置にパーツを出現
            </Accordion.Title>
            <Accordion.Content active={isOpen}>
                {props.items.map((item, index) => {
                    const indexBase = WWAConsts.ATR_APPERANCE_BASE + (index * WWAConsts.REL_ATR_APPERANCE_UNIT_LENGTH);

                    return (
                        <div key={index}>
                            <Form.Group>
                                <Form.Input
                                    width={6}
                                    type="number"
                                    value={item.number}
                                    onChange={(event, data) => {
                                        props.onChange(data.value, indexBase + WWAConsts.REL_ATR_APPERANCE_ID)
                                    }}
                                />
                                <Button.Group widths={3}>
                                    <Button
                                        active={item.type === PartsType.OBJECT}
                                        onClick={() => props.onChange(PartsType.OBJECT.toString(), indexBase + WWAConsts.REL_ATR_APPERANCE_TYPE)}
                                        content="物体"
                                    />
                                    <Button
                                        active={item.type === PartsType.MAP}
                                        onClick={() => props.onChange(PartsType.MAP.toString(), indexBase + WWAConsts.REL_ATR_APPERANCE_TYPE)}
                                        content="背景"
                                    />
                                </Button.Group>
                            </Form.Group>
                            <Form.Group>
                                <CoordInput
                                    width={6}
                                    value={item.chipX}
                                    onChange={(value) => props.onChange(value, indexBase + WWAConsts.REL_ATR_APPERANCE_X)}
                                />
                                <CoordInput
                                    width={6}
                                    value={item.chipY}
                                    onChange={(value) => props.onChange(value, indexBase + WWAConsts.REL_ATR_APPERANCE_Y)}
                                />
                            </Form.Group>
                        </div>
                    );
                })}
            </Accordion.Content>
        </Accordion>
    );
};

/**
 * パーツ属性から「指定位置にパーツを出現」に対応した値を出力します。
 */
export function getPartsAppearValues(attributes: PartsAttributeItems): AppearPartsItem[] {
    const values = attributes.slice(
        WWAConsts.ATR_APPERANCE_BASE,
        WWAConsts.ATR_APPERANCE_BASE + (WWAConsts.REL_ATR_APPERANCE_UNIT_LENGTH * WWAConsts.APPERANCE_PARTS_MAX_INDEX) + (WWAConsts.REL_ATR_APPERANCE_UNIT_LENGTH)
    );

    let result: AppearPartsItem[] = [];
    for (let itemsIndex = WWAConsts.APPERANCE_PARTS_MIN_INDEX; itemsIndex <= WWAConsts.APPERANCE_PARTS_MAX_INDEX; itemsIndex++) {
        const valuesIndex = itemsIndex * WWAConsts.REL_ATR_APPERANCE_UNIT_LENGTH;

        const item: AppearPartsItem = {
            number: values[valuesIndex + WWAConsts.REL_ATR_APPERANCE_ID],
            chipX: convertRelativeValueFromCoord(values[valuesIndex + WWAConsts.REL_ATR_APPERANCE_X]),
            chipY: convertRelativeValueFromCoord(values[valuesIndex + WWAConsts.REL_ATR_APPERANCE_Y]),
            type: values[valuesIndex + WWAConsts.REL_ATR_APPERANCE_TYPE]
        };

        if (!(item.type in PartsType)) {
            throw new Error(`不明なパーツ種類 ${item.type} を検出しました。`);
        }

        result.push(item);
    }

    return result;
}
