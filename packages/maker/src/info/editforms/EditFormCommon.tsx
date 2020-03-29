import React from "react";
import WWAConsts from "../../classes/WWAConsts";
import { MoveType } from "../../classes/WWAData";

interface EditFormsProps {
    forms: EditForm[]
}

/**
 * パーツ編集の編集項目1つ1つを示す型です。
 *     パーツ編集画面というのは数字入力欄が大変多く、冗長になることが予想されますので、
 *     共通化出来る入力欄をここで処理します。
 */
export type EditForm =
    {
        type: "NUMBER",
        label: string;
        value: number
    } | {
        type: "SELECT",
        label: string;
        selectableItems: {
            label: string,
            value: number
        }[],
        value: number
    } | {
        type: "STATUS",
        items: {
            energy?: StatusEditFormItem,
            strength: StatusEditFormItem,
            defence: StatusEditFormItem,
            gold?: StatusEditFormItem
        };
    } | {
        type: "MESSAGE",
        label?: string,
        value: string
    } | {
        type: "URL",
        label: string,
        value: string
    } | {
        type: "STRING",
        label: string,
        value: string
    };

/**
 * パーツ編集で必要になるステータス入力値のうち、ステータス1つ分で必要なプロパティを示す型です。
 */
type StatusEditFormItem = {
    label: string,
    value: number
}

/**
 * プロパティのデータから、対応した編集フォームを提供します。
 * @todo onChange を実装する
 */
export class EditForms extends React.Component<EditFormsProps> {

    /**
     * 編集フォーム1つ分を表示します。
     */
    private renderEditForm(editForm: EditForm) {
        switch (editForm.type) {
            case "NUMBER":
                return (
                    <>
                        {editForm.label}
                        <input type="number" value={editForm.value} onChange={() => {}}></input>
                    </>
                );
            case "SELECT":
                return (
                    <>
                        {editForm.label}
                        <select defaultValue={editForm.value}>
                            {editForm.selectableItems.map((option, optionIndex) =>
                                <option key={optionIndex} value={option.value}>
                                    {option.label}
                                </option>
                            )}
                        </select>
                    </>
                );
            case "STATUS":
                return (
                    <>
                        {editForm.items.energy !== undefined &&
                            <div>
                                {editForm.items.energy.label}
                                <input type="number" value={editForm.items.energy.value} onChange={() => {}}></input>
                            </div>
                        }
                        <div>
                            {editForm.items.strength.label}
                            <input type="number" value={editForm.items.strength.value} onChange={() => {}}></input>
                        </div>
                        <div>
                            {editForm.items.defence.label}
                            <input type="number" value={editForm.items.defence.value} onChange={() => {}}></input>
                        </div>
                        {editForm.items.gold !== undefined &&
                            <div>
                                {editForm.items.gold.label}
                                <input type="number" value={editForm.items.gold.value} onChange={() => {}}></input>
                            </div>
                        }
                    </>
                );
            case "MESSAGE":
                return (
                    <>
                        {editForm.label !== undefined &&
                            <div>{editForm.label}</div>
                        }
                        <textarea value={editForm.value} onChange={() => {}}></textarea>
                    </>
                );
            case "URL":
                return (
                    <>
                        <div>{editForm.label}</div>
                        <input type="text" value={editForm.value} onChange={() => {}}></input>
                    </>
                );
        }
        return (
            <div>
                <p>その入力フォームはまだ対応していません。</p>
            </div>
        );
    }
    public render() {
        return (
            <>
                {this.props.forms.map((editForm, editFormIndex) => {
                    return (
                        <div key={editFormIndex}>
                            {this.renderEditForm(editForm)}
                        </div>
                    );
                })}
            </> // 「OK」「キャンセル」ボタンは外側の ObjectEditForm/MapEditForm コンポーネントで配置されます。
        )
    }
}

/**
 * 「サウンド番号」の入力フォームの情報を作成します。
 * @see EditForm
 */
export const createSoundEditForm: (soundNumberValue: number) => EditForm = soundNumberValue => {
    return {
        type: "NUMBER",
        label: "サウンド番号",
        value: soundNumberValue
    };
};

/**
 * 「待ち時間」の入力フォームの情報を作成します。
 * @see EditForm
 */
export const createWaitTimeEditForm: (waitTimeValue: number) => EditForm = waitTimeValue => {
    return {
        type: "NUMBER",
        label: "待ち時間",
        value: waitTimeValue
    };
};

/**
 * メッセージの入力フォームの情報を作成します。
 * @see EditForm
 */
export const createMessageEditForm: (message: string, label?: string) => EditForm = (message, label) => ({
    type: "MESSAGE",
    label: label,
    value: message,
});

/**
 * 「動作属性」の入力フォームの情報を作成します。
 * @see EditForm
 */
export const createMoveTypeEditForm = (moveTypeValue: number): EditForm => ({
    type: "SELECT",
    label: "動作属性",
    selectableItems: [
        {
            label: "静止",
            value: MoveType.STATIC
        }, {
            label: "プレイヤー追尾",
            value: MoveType.CHASE_PLAYER
        }, {
            label: "逃げる",
            value: MoveType.RUN_OUT
        }, {
            label: "うろうろする",
            value: MoveType.HANG_AROUND
        }
    ],
    value: moveTypeValue
});

/**
 * 「通行区分」の入力フォームの情報を作成します。
 * @see EditForm
 */
export const createStreetTypeEditForm = (passableValue: number): EditForm => ({
    type: "SELECT",
    label: "通行区分",
    selectableItems: [
        {
            label: "通行不可",
            value: 0
        }, {
            label: "通行可",
            value: WWAConsts.PASSABLE_OBJECT
        }
    ],
    value: passableValue
});

/**
 * モンスターやステータス変化などで使用されているステータス入力フォームの情報を作成します。
 */
export const createStatusEditForm = (
    energyValue: number,
    strengthValue: number,
    defenceValue: number,
    goldValue: number
): EditForm => ({
    type: "STATUS",
    items: {
        energy: {
            label: "生命力",
            value: energyValue
        },
        strength: {
            label: "攻撃力",
            value: strengthValue
        },
        defence: {
            label: "防御力",
            value: defenceValue
        },
        gold: {
            label: "所持金",
            value: goldValue
        }
    }
});

/**
 * パーツの編集画面のコンポーネントに割り当てる型です。
 */
export type PartsEditComponent = (attribute: number[], message: string) => JSX.Element;

/**
 * URLゲートの編集画面のコンポーネントです。
 *     物体パーツのURLゲートも背景パーツのURLゲートも編集画面は共通のため、物体背景ともにこのコンポーネントから参照されます。
 */
export const URLGateEdit: PartsEditComponent = (attribute, message) => {
    const messageLines = message.split(/\r|\n|\r\n/);
    return (
        <div>
            <p>URLゲート</p>
            <EditForms
                forms={[
                    {
                        type: "URL",
                        label: "リンク先のURLアドレス",
                        value: messageLines[0]
                    }, {
                        type: "STRING",
                        label: "URL TARGET",
                        value: messageLines[1]
                    }
                ]}
            />
        </div>
    )
}
