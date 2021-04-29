import React, { useState } from "react";
import { PartsType, PartsAttributeItems } from "../../classes/WWAData";
import { Accordion, Icon } from "semantic-ui-react";
import WWAConsts from "../../classes/WWAConsts";
import { convertRelativeValueFromCoord } from "../../common/convertRelativeValue";
import { InputChangeFunctionWithIndex, AppearPartsItem } from "./utils";
import PartsAppearInputItem from "./PartsAppearInputItem";

// 指定位置にパーツを出現 関係のコンポーネントをまとめたファイルです。

interface PartsAppearEditProps {
    attribute: PartsAttributeItems,
    onChange: InputChangeFunctionWithIndex,
    partsMax: {
        [key in PartsType]: number
    }
};

/**
 * 指定位置にパーツを出現の編集フォームのコンポーネントです。
 *     指定位置にパーツを出現は二者択一だけ別の編集画面が用意されています。
 *     このように、パーツ種別に応じて最適な編集フォームを用意することが目的となっています。
 */
export type PartsAppearEditComponent = React.FunctionComponent<PartsAppearEditProps>;

/**
 * パーツ1つ分の項目を出力するメソッドを作成します。
 * @param firstIndex ATR_APPERANCE_BASE から最初の項目のインデックス値 (入力時にステートへ送り込む際に使用します)
 */
function createRenderingPartsAppearItem(props: PartsAppearEditProps, firstIndex: number) {
    return (item: AppearPartsItem, index: number) => {
        const indexBase = WWAConsts.ATR_APPERANCE_BASE + firstIndex + (index * WWAConsts.REL_ATR_APPERANCE_UNIT_LENGTH);

        return (
            <PartsAppearInputItem
                key={index}
                item={item}
                index={indexBase}
                partsIDMax={props.partsMax[item.type]}
                onChange={props.onChange}
            />
        );
    }
}

/**
 * 指定位置にパーツを出現の入力フォームです。
 */
export const PartsAppearInput: PartsAppearEditComponent = props => {
    const [isOpened, toggle] = useState(false);
    const items = getPartsAppearValues(props.attribute);

    return (
        <Accordion>
            <Accordion.Title active={isOpened} onClick={() => toggle(!isOpened)}>
                <Icon name="dropdown" />
                指定位置にパーツを出現
            </Accordion.Title>
            <Accordion.Content active={isOpened}>
                {items.map(createRenderingPartsAppearItem(props, 0))}
            </Accordion.Content>
        </Accordion>
    );
};

/**
 * 二者択一で使用する指定位置にパーツを出現の入力フォームです。
 */
export const PartsAppearSelectInput: PartsAppearEditComponent = props => {
    const [isYesOpened, toggleYes] = useState(false);
    const [isNoOpened, toggleNo] = useState(false);
    const items = getPartsAppearValues(props.attribute);
    const yesItems = items.slice(0, WWAConsts.APPERANCE_PARTS_MAX_INDEX_YES + 1);
    const noItems = items.slice(WWAConsts.APPERANCE_PARTS_MIN_INDEX_NO);

    return (
        <>
            <Accordion>
                <Accordion.Title active={isYesOpened} onClick={() => toggleYes(!isYesOpened)}>
                    <Icon name="dropdown" />
                    YESを選択したとき
                </Accordion.Title>
                <Accordion.Content active={isYesOpened}>
                    {yesItems.map(createRenderingPartsAppearItem(props, 0))}
                </Accordion.Content>
            </Accordion>
            <Accordion>
                <Accordion.Title active={isNoOpened} onClick={() => toggleNo(!isNoOpened)}>
                    <Icon name="dropdown" />
                    NOを選択したとき
                </Accordion.Title>
                <Accordion.Content active={isNoOpened}>
                    {noItems.map(createRenderingPartsAppearItem(props, WWAConsts.APPERANCE_PARTS_MIN_INDEX_NO * WWAConsts.REL_ATR_APPERANCE_UNIT_LENGTH))}
                </Accordion.Content>
            </Accordion>
        </>
    );
}

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
