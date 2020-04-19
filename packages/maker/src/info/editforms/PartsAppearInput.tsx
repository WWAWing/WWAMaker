import React from "react";
import { PartsType, PartsAttributeItems } from "../../classes/WWAData";
import { Accordion, Form, Icon, Dropdown } from "semantic-ui-react";
import WWAConsts from "../../classes/WWAConsts";
import { RelativeValue, convertRelativeValueFromCoord } from "../../common/convertRelativeValue";
import { CoordInput } from "./EditFormUtils";
import { connect, MapStateToProps } from "react-redux";
import { StoreType } from "../../State";
import getPartsCountPerIncreaseUnit from "../../common/getPartsCountPerIncreaseUnit";

// 指定位置にパーツを出現 関係のコンポーネントをまとめたファイルです。

/**
 * 指定位置にパーツを出現の各項目を表した型です。
 */
type AppearPartsItem = { number: number, chipX: RelativeValue, chipY: RelativeValue, type: PartsType };

type InputChangeFunctionWithIndex = (value: string, index: number) => void;

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

type StateProps = {
    objPartsMax?: number,
    mapPartsMax?: number,
    mapMax?: number
};

/**
 * PartsAppearInput では扱えるパーツの最大値を取得するために WWAData から値を受け取ります。
 */
const mapStateToProps: MapStateToProps<StateProps, StateProps, StoreType> = state => ({
    objPartsMax: state.wwaData?.objPartsMax,
    mapPartsMax: state.wwaData?.mapPartsMax,
    mapMax: state.wwaData?.mapWidth
});

export type PartsAppearInputProps = {
    active: boolean,
    items: AppearPartsItem[],
    onToggle: (active: boolean) => void,
    onChange: InputChangeFunctionWithIndex
};

/**
 * 指定位置にパーツを出現の入力フォームです。
 * @todo onChange の処理内容を正しく整える
 */
const PartsApperarInputComponent: React.FunctionComponent<PartsAppearInputProps & StateProps> = props => {

    function getPartsIDMax(type: PartsType) {
        switch (type) {
            case PartsType.OBJECT:
                return props.objPartsMax || 0;
            case PartsType.MAP:
                return props.mapPartsMax || 0;
        }
    }

    return (
        <Accordion>
            <Accordion.Title active={props.active} onClick={() => props.onToggle(!props.active)}>
                <Icon name="dropdown" />
                指定位置にパーツを出現
            </Accordion.Title>
            <Accordion.Content active={props.active}>
                {props.items.map((item, index) => {
                    const indexBase = WWAConsts.ATR_APPERANCE_BASE + (index * WWAConsts.REL_ATR_APPERANCE_UNIT_LENGTH);
                    const partsIDMax = getPartsCountPerIncreaseUnit(getPartsIDMax(item.type));

                    return (
                        <div key={index}>
                            <Form.Group>
                                <Form.Input
                                    width={6}
                                    type="number"
                                    min={0}
                                    max={partsIDMax}
                                    action={(
                                        <Dropdown
                                            button
                                            basic
                                            options={PartsTypeOptions}
                                            value={item.type.toString()}
                                            onChange={(event, data) => {
                                                props.onChange(data.value as string, indexBase + WWAConsts.REL_ATR_APPERANCE_TYPE);
                                            }}
                                        />
                                    )}
                                    actionPosition="left"
                                    value={item.number}
                                    onChange={(event, data) => {
                                        // FIXME: 空欄にすると Received NaN for the `value` attribute. If this is expected, cast the value to a string. が発生する
                                        props.onChange(data.value as string, indexBase + WWAConsts.REL_ATR_APPERANCE_ID)
                                    }}
                                />
                            </Form.Group>
                            <Form.Group>
                                <CoordInput
                                    width={12}
                                    value={item.chipX}
                                    mapWidthMax={props.mapMax}
                                    onChange={(value) => props.onChange(value, indexBase + WWAConsts.REL_ATR_APPERANCE_X)}
                                />
                                <CoordInput
                                    width={12}
                                    value={item.chipY}
                                    mapWidthMax={props.mapMax}
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

export const PartsApperarInput = connect(mapStateToProps)(PartsApperarInputComponent);

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
