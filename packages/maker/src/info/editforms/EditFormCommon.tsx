import React from "react";

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

export const createSoundEditForm: (soundNumberValue: number) => EditForm = soundNumberValue => {
    return {
        type: "NUMBER",
        label: "サウンド番号",
        value: soundNumberValue
    };
};

export const createWaitTimeEditForm: (waitTimeValue: number) => EditForm = waitTimeValue => {
    return {
        type: "NUMBER",
        label: "待ち時間",
        value: waitTimeValue
    };
};

export const createMessageEditForm: (message: string) => EditForm = message => ({
    type: "MESSAGE",
    value: message
});
