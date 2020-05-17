/**
 * 配列 target から指定した場所に番号を敷き詰めます。
 * @param target 
 * @param value
 * @param x 
 * @param y 
 * @param width 
 * @param height 
 */
const fillParts = (
    target: number[][],
    value: number,
    x: number,
    y: number,
    width: number,
    height: number
): number[][] => {
    return target.map((line, lineIndex) => {
        if (lineIndex < y || lineIndex >= y + height) {
            return line;
        }
        return line.slice().fill(value, x, x + width);
    });
};

export default fillParts;
