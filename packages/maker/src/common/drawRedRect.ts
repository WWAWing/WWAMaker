/**
 * 選択中のパーツを示す「赤い四角」を描画します。
 * @param context 描画に使用する Canvas のコンテキスト変数
 * @param x X座標
 * @param y Y座標
 * @param w 横幅
 * @param h 縦幅
 */
export default function drawRedRect(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    context.save();

    context.strokeStyle = 'rgb(255, 0, 0)';
    context.lineWidth = 2;
    context.strokeRect(x + 1, y + 1, w - 2, h - 2);

    context.restore();
}
