// このファイルはパーツ編集画面で頻繁に使用されるテキストボックスやセレクトボックスなどをまとめたコンポーネント集です。

import { PartsType } from "../../../classes/WWAData";
import { RelativeValue } from "../../../common/convertRelativeValue";
import { PartsEditAttributeChange } from "../definitions";

/**
 * テキストボックスやセレクトボックスで変更が生じた際に実行するコールバック関数の型です。
 */
export type InputChangeFunction = (value: string) => void;
/**
 * 仕様は InputChangeFunction と同じです。
 * name には主にステータスの入力でどのステータスか値が含まれています。
 */
export type InputChangeFunctionWithName = (value: string, name: string) => void;
/**
 * 仕様は InputChangeFunction と同じです。
 * index には主に指定位置にパーツを出現で何番目の項目かが含まれています。
 */
export type InputChangeFunctionWithIndex = PartsEditAttributeChange;

/**
 * 指定位置にパーツを出現の各項目を表した型です。
 */
export type AppearPartsItem = { number: number, chipX: RelativeValue, chipY: RelativeValue, type: PartsType };

export type CoordInputChangeFunction = (x: string, y: string) => void;
