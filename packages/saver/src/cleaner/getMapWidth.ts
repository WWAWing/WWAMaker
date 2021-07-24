import { WWAData } from "@wwawing/common-interface";
import { WWAConsts } from "../utils/wwa_data";

/**
 * マップを正方形の範囲に収めて、その1辺の長さをマス単位で取得します。
 * @param map 対象の背景パーツのマップ
 * @param mapObject 対象の物体パーツのマップ
 * @returns 正方形で収められる最小の1辺の長さ
 * @todo マップサイズ 101 未満だと 101 が返ってこないので直す
 */
export default function getMapWidth(map: WWAData["map"], mapObject: WWAData["mapObject"]): number {
    const maxWidth = Math.min(map.length, mapObject.length, WWAConsts.MAP_SIZE_MAX);

    /**
     * マップサイズの圧縮アルゴリズムについて
     *     一番右下から一番左上に向けて移動する point を設け、その point 中心に上方向、左方向にパーツが配置されていないか確認します。
     *     その確認のところで端に着いた場合はパーツが配置されていないと判断し、1マス左上に point を進みます。
     *     途中で見つかった場合はその時点の point を出力します。
     */
    for (let point = maxWidth - 1; point >= 0; point--) {
        if (map[point][point] !== 0 || mapObject[point][point] !== 0) {
            return getMapWidthPerIncreaseUnit(point);
        }
        for (let index = point - 1; index >= 0; index--) {
            if (map[point][index] !== 0 ||
                mapObject[point][index] !== 0 ||
                map[index][point] !== 0 ||
                mapObject[index][point] !== 0) {
                return getMapWidthPerIncreaseUnit(point);
            }
        }
    }

    return 0;
}

/**
 * 指定したマップ幅をマップ増減幅の単位で収まる値に計算します。
 *     例えばマップ幅 390 でマップ増減幅の単位が 100 とした場合は、 401 が出力されます。
 * @param mapWidth
 * @todo common-interface とかで共通化したい
 */
function getMapWidthPerIncreaseUnit(mapWidth: number): number {
    if (mapWidth < WWAConsts.MAP_SIZE_DEFAULT) {
        return WWAConsts.MAP_SIZE_DEFAULT;
    }
    return Math.ceil(mapWidth / WWAConsts.MAP_SIZE_INCREASE_UNIT) * WWAConsts.MAP_SIZE_INCREASE_UNIT + 1;
}
