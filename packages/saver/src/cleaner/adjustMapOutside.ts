/**
 * マップサイズを削減したり、逆に補填したりします。
 * 補填には 0 が追加されます。
 * @param targetMap 対象のマップ2次元配列
 * @param afterMapWidth 希望の横幅サイズ
 */
export default function adjustMapOutside(targetMap: number[][], afterMapWidth: number): number[][] {
    const actualMapWidth = Math.max(targetMap.length, targetMap.map(line => line.length).reduce((max, current) => Math.max(max, current)));
    if (actualMapWidth <= afterMapWidth) {
        return appendMapPartsOutside(targetMap, afterMapWidth);
    } else {
        return removeMapPartsOutside(targetMap, afterMapWidth);
    }
}

function appendMapPartsOutside(map: number[][], mapWidth: number) {
    let result = map.slice();
    for (let y = 0; y < mapWidth; y++) {
        if (y >= result.length) {
            result.push([]);
        }
        for (let x = 0; x < mapWidth; x++) {
            if (x >= result[y].length) {
                result[y].push(0);
            }
        }
    }
    return result;
}

function removeMapPartsOutside(map: number[][], mapWidth: number): number[][] {
    let result = map.slice();
    result.splice(mapWidth);
    result.forEach(line => line.splice(mapWidth));
    return result;
}
