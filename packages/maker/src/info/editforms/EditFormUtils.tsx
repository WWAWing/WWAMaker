import React from "react";
import WWAConsts from "../../classes/WWAConsts";
import { MoveType } from "../../classes/WWAData";
import { Input, Dropdown, DropdownItemProps, Form, TextArea, Icon, StrictIconProps, Label, Button } from "semantic-ui-react";
import { RelativeValue, convertDataValueFromRelativeCoord, convertRelativeValueFromStatus, convertDataValueFromRelativeStatus } from "../../common/convertRelativeValue";
import BrowseMap from "../../common/BrowseMap";
import { useState } from "react";
import { ItemPartsBrowse, ObjectPartsBrowse } from "../../common/BrowseParts";

/**
 * NOTE:
 * このファイルは utils ディレクトリに移行します。
 * utils ディレクトリでは、1コンポーネント1ファイルの構成としています。
 * 型定義については utils/index.ts で定義していますが、定義場所はまだ仮の段階のため、後で移動する可能性があります。
 */

/**
 * テキストボックスやセレクトボックスで変更が生じた際に実行するコールバック関数の型です。
 */
type InputChangeFunction = (value: string) => void;
type CoordInputChangeFunction = (x: string, y: string) => void;
type InputChangeFunctionWithName = (value: string, name: string) => void;

/**
 * パーツ編集で必要になるステータス入力値のうち、ステータス1つ分で必要なプロパティを示す型です。
 */
type NumberEditFormItem = {
    label?: string,
    value: number
};

export const NumberInput: React.FunctionComponent<{
    value: number,
    label: string,
    name?: string
    min?: number,
    max?: number
    onChange: InputChangeFunction
}> = props => (
    <Form.Field>
        <label>{props.label}</label>
        <Input
            type="number"
            name={props.name}
            value={props.value}
            min={props.min}
            max={props.max}
            onChange={(event, data) => {
                props.onChange(data.value);
            }}
        />
    </Form.Field>
);

/**
 * 数字を入力するコンポーネントを作成します。
 */
const createNumberInput = (label: string) => {
    return (props: {
        value: number,
        onChange: InputChangeFunction
    }) => (
        <NumberInput
            label={label}
            value={props.value}
            onChange={props.onChange}
        />
    );
};

export const SoundNumberInput = createNumberInput("サウンド番号");
export const WaitTimeInput = createNumberInput("待ち時間");

export const SelectInput: React.FunctionComponent<{
    selectableItems: DropdownItemProps[],
    value: number,
    label: string,
    onChange: InputChangeFunction
}> = props => (
    <Form.Field>
        <label>{props.label}</label>
        <Dropdown
            options={props.selectableItems}
            value={props.value}
            selection
            onChange={(event, data) => {
                if (data.value === undefined) {
                    return;
                }
                const value = data.value as string;
                props.onChange(value);
            }}
        />
    </Form.Field>
);

/**
 * セレクトボックスのコンポーネントを作成します。
 */
const createSelectInput = (label: string, selectableItems: DropdownItemProps[]) => {
    return (props: {
        value: number,
        onChange: InputChangeFunction
    }) => (
        <SelectInput
            label={label}
            selectableItems={selectableItems}
            value={props.value}
            onChange={props.onChange}
        />
    );
};

export const MoveTypeInput = createSelectInput("動作属性", [
    {
        text: "静止",
        value: MoveType.STATIC,
    }, {
        text: "プレイヤー追尾",
        value: MoveType.CHASE_PLAYER
    }, {
        text: "逃げる",
        value: MoveType.RUN_OUT
    }, {
        text: "うろうろする",
        value: MoveType.HANG_AROUND
    }
]);
export const PassableInput = createSelectInput("通行区分", [
    {
        text: "通行不可",
        value: 0
    }, {
        text: "通行可",
        value: WWAConsts.PASSABLE_OBJECT
    }
]);

export const MessageInput: React.FunctionComponent<{
    value: string,
    label: string,
    onChange: InputChangeFunction
}> = props => (
    <Form.Field>
        <label>{props.label}</label>
        <TextArea
            value={props.value}
            onChange={(event, data) => {
                if (data.value === undefined) {
                    return;
                }
                const value = typeof data.value === "number" ? data.value.toString() : data.value;
                props.onChange(value);
            }}
        />
    </Form.Field>
);

/**
 * モンスターやアイテムで使用するステータス入力欄です。
 *     「ステータス変化」といった負の値を扱うステータス入力欄と、「モンスター」や「アイテム」といった正の値しか扱わないステータス入力欄を分けるため、作成するメソッドを予め用意しています。
 * @param min 最小値
 * @param max 最大値
 * @param getValue NumberInput コンポーネントに値を渡す際に実行するメソッド
 * @param setValue NumberInput コンポーネントで入力した値からプロパティの onChange メソッドに渡す際に実行するメソッド
 */
function createStatusInput(
    min: number,
    max: number,
    getValue: (value: number) => number,
    setValue: (value: string) => string
): React.FC<{
    items: {
        energy?: NumberEditFormItem,
        strength: NumberEditFormItem,
        defence: NumberEditFormItem,
        gold?: NumberEditFormItem,
    },
    onChange: InputChangeFunctionWithName
}> {
    /**
     * @param props 下記の情報を含めた連想配列
     * 
     *     items: energy, strength, defence, gold の情報
     *     label の指定がない場合はそれぞれ 生命力、攻撃力、防御力、所持金 になります。
     * 
     *     onChange: 入力欄が変更した場合に発生するメソッド
     *     どのテキストボックから入力されたかは、 event.target.name から確認できます。
     */
    return (props) => {

        const statusNumberInput = (item: NumberEditFormItem, name: string, defaultLabel: string) => (
            <NumberInput
                label={item.label !== undefined ? item.label : defaultLabel}
                min={min}
                max={max}
                onChange={value => props.onChange(setValue(value), name)}
                name={name}
                value={getValue(item.value)}
            />
        );

        return (
            <>
                {props.items.energy !== undefined &&
                    statusNumberInput(props.items.energy, "energy", "生命力")
                }
                {statusNumberInput(props.items.strength, "strength", "攻撃力")}
                {statusNumberInput(props.items.defence, "defence", "防御力")}
                {props.items.gold !== undefined &&
                    statusNumberInput(props.items.gold, "gold", "所持金")
                }
            </>
        );
    };
}

/**
 * 正の値しか扱わないステータス入力欄
 */
export const StatusInput = createStatusInput(0, 60000, value => value, value => value);
/**
 * 正の値と負の値を扱うステータス入力欄
 */
export const AdjustStatusInput = createStatusInput(
    -30000,
    30000,
    value => convertRelativeValueFromStatus(value),
    value => convertDataValueFromRelativeStatus(parseInt(value)).toString()
);

/**
 * URL を入力するテキストボックスです。
 *     後述の StringInput と内容は共通ですが、今後 URL 入力だけ仕様変更が出来るように別に独立しています。
 *     テキストボックスには type="url" と指定していませんが、これは相対パスの文字列でも検出出来るようにするためです。
 */
export const URLInput: React.FunctionComponent<{
    label: string,
    value: string,
    onChange: InputChangeFunction
}> = props => (
    <Form.Field>
        <label>{props.label}</label>
        <Input
            type="text"
            value={props.value}
            onChange={(event, data) => {
                props.onChange(data.value);
            }}
        />
    </Form.Field>
);

export const StringInput: React.FunctionComponent<{
    label: string,
    value: string,
    onChange: InputChangeFunction
}> = props => (
    <Form.Field>
        <label>{props.label}</label>
        <Input
            type="text"
            value={props.value}
            onChange={(event, data) => {
                props.onChange(data.value);
            }}
        />
    </Form.Field>
);

/**
 * 一部の物体パーツの編集画面に付いている「サウンド番号」「動作属性」「メッセージ」の3つの入力欄をセットにしたコンポーネントです。
 */
export const ObjectCommonInput: React.FunctionComponent<{
    messageLabel: string,
    soundValue: number,
    moveValue: number,
    messageValue: string,
    onSoundChange: InputChangeFunction,
    onMoveChange: InputChangeFunction,
    onMessageChange: InputChangeFunction
}> = props => (
    <>
        <SoundNumberInput
            value={props.soundValue}
            onChange={props.onSoundChange}
        />
        <MoveTypeInput
            value={props.moveValue}
            onChange={props.onMoveChange}
        />
        <MessageInput
            label={props.messageLabel}
            value={props.messageValue}
            onChange={props.onMessageChange}
        />
    </>
);

/**
 * 物体パーツ番号の参照機能が付いた入力コンポーネントです。
 */
export const ObjectPartsInput: React.FC<{
    value: number,
    label?: string,
    onChange: InputChangeFunction
}> = props => {
    const [isBrowseOpen, setIsBrowseOpen] = useState(false);

    return (
        <Form.Field>
            {props.label &&
                <label>{props.label}</label>
            }
            <Label>
                {props.value}
            </Label>
            <Button
                onClick={() => {
                    setIsBrowseOpen(true);
                }}
            >
                参照
            </Button>
            <ObjectPartsBrowse
                isOpen={isBrowseOpen}
                onClose={() => {
                    setIsBrowseOpen(false);
                }}
                onSubmit={(partsNumber) => {
                    props.onChange(partsNumber.toString());
                }}
                selectingPartsNumber={props.value}
            />
        </Form.Field>
    );
};

/**
 * アイテムパーツ番号の参照機能が付いた入力コンポーネントです。
 */
export const ItemPartsInput: React.FC<{
    value: number,
    label: string,
    onChange: InputChangeFunction
}> = props => {
    const [isBrowseOpen, setIsBrowseOpen] = useState(false);

    return (
        <Form.Field>
            <label>{props.label}</label>
            <Label>
                {props.value}
            </Label>
            <Button
                onClick={() => {
                    setIsBrowseOpen(true);
                }}
            >
                参照
            </Button>
            <ItemPartsBrowse
                isOpen={isBrowseOpen}
                onClose={() => {
                    setIsBrowseOpen(false);
                }}
                onSubmit={(partsNumber) => {
                    props.onChange(partsNumber.toString());
                }}
                selectingPartsNumber={props.value}
            />
        </Form.Field>
    );
};

/**
 * 座標を入力あるいは参照するコンポーネントです。
 */
export const CoordInput: React.FC<{
    label?: string,
    x: RelativeValue,
    y: RelativeValue,
    onSubmit: CoordInputChangeFunction,
}> = props => {

    /**
     * coordOptions は座標の種別を選択するドロップダウンの項目定数です。
     */
    const coordOptions: { text: string, value: RelativeValue["type"], icon: StrictIconProps["name"] }[] = [{
        text: "絶対",
        value: "ABSOLUTE",
        icon: "point"
    }, {
        text: "相対",
        value: "RELATIVE",
        icon: "arrows alternate"
    }, {
        text: "プレイヤー",
        value: "PLAYER",
        icon: "user"
    }];

    const [isBrowseOpen, setBrowseOpen] = useState(false);

    const ValueLabel: React.FC<{ name: string, value: RelativeValue }> = ({ name, value }) => {
        const coordOption = coordOptions.find(options => options.value === value.type);
        return (
            <Label>
                {name}
                <Label.Detail>
                    <Icon name={coordOption?.icon} />
                    {value.type !== "PLAYER" && value.value}
                </Label.Detail>
            </Label>
        );
    }

    return (
        <Form.Field>
            <ValueLabel name="X" value={props.x} />
            <ValueLabel name="Y" value={props.y} />
            <Button onClick={() => setBrowseOpen(true)}>参照</Button>
            <BrowseMap
                isOpen={isBrowseOpen}
                defaultValue={{ x: props.x, y: props.y }}
                onSubmit={(x, y) => {
                    // TODO: 空欄の値では NaN が入ってくる可能性がある
                    props.onSubmit(
                        convertDataValueFromRelativeCoord(x).toString(),
                        convertDataValueFromRelativeCoord(y).toString()
                    );
                }}
                onClose={() => setBrowseOpen(false)}
            />
        </Form.Field>
    );
};
