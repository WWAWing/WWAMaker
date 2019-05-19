/**
 * 作成ツールで起こりうるエラーを定義するインターフェイスです。
 *     作成ツールの拡張によってこの内容は増えるかもしれないです。
 */
export interface MakerError {
    title: string;
    message: string;
}
