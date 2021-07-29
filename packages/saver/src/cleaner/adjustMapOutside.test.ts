import { WWAConsts } from "../utils/wwa_data";
import adjustMapOutside from "./adjustMapOutside";
import getMapWidth from "./getMapWidth";

test("空のマップ配列が補填されている", () => {
    const map: number[][] = [[0]];
    const mapWidth = getMapWidth(map, map);

    const result = adjustMapOutside(map, mapWidth);

    expect(result.length).toBe(WWAConsts.MAP_SIZE_DEFAULT);
    result.forEach(resultLine => {
        expect(resultLine.length).toBe(WWAConsts.MAP_SIZE_DEFAULT);
    });
});

// TODO: 余計なマップ領域を削減するテストも書きたい
