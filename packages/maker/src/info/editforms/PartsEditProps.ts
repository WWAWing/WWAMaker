
/**
 * パーツ編集に必要なプロパティの型です。
 *     パーツの編集画面を開くには「パーツの属性」「メッセージ」が必要です。
 *     各パーツの編集画面を実装する際にはプロパティが必要になるのですが、そのプロパティの型を共通化するために用意しました。
 */
export type PartsEditPropsWithoutMessage = {
    attribute: number[];
}

/**
 * メッセージが付いた型です。
 */
export type PartsEditPropsWithMessage = PartsEditPropsWithoutMessage & {
    message: string
}
