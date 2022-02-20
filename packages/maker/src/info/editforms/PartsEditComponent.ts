import { PartsAppearEditComponent } from "./PartsAppearInput";

// パーツの編集画面で使用される型をまとめたファイルです。

/**
 * パーツの編集画面のコンポーネントに割り当てる型です。
 */
export type PartsEditComponent = React.FunctionComponent<{
    attribute: number[],
    message: string,
    onAttributeChange: PartsEditAttributeChange,
    onMessageChange: PartsEditMessageChange
}>;
export type PartsEditAttributeItem = { value: string, attributeIndex: number };
/**
 * パーツの編集画面で属性値に対応したフォームが変更された場合に実行されるメソッドの型です。
 *     value: 変更したい属性値 (数字への変換は親コンポーネント側で行う必要があります)
 *     attributeIndex: 親コンポーネントの State で変更したい属性の番号
 */
export type PartsEditAttributeChange = (...values: PartsEditAttributeItem[]) => void;
/**
 * パーツの編集画面でメッセージに対応したフォームが変更された場合に実行されるメソッドの型です。
 *     value: 変更したいメッセージ内容
 */
export type PartsEditMessageChange = (value: string) => void;

/**
 * 物体パーツや背景パーツの種別に対応した編集画面の情報の型です。
 *     name: 名前 (パーツ種別のセレクトボックスに表示されます)
 *     component: コンポーネントそのもの
 *     partsAppear: 指定位置にパーツを出現で使用するコンポーネント
 */
type PartsEditTableItem = {
    id: number,
    name: string,
    component: PartsEditComponent,
    partsAppear?: PartsAppearEditComponent
};
export type PartsEditComponentTable = PartsEditTableItem[];
