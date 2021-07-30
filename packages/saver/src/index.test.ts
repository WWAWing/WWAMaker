import Saver from ".";
import loadMapData from "./samples/loadMapData";

import { decompressMapData } from "@wwawing/loader/lib/core/decompressor";
import { WWADataExtractor } from "@wwawing/loader/lib/core/extractor";
import { TextLoader } from "@wwawing/loader/lib/core/text-loader";
import { NodeEventEmitter } from "@wwawing/event-emitter";

test("Standard Map の出力内容が同じ", async () => {
    const wwaData = await loadMapData("wwamap.dat");
    const wwaDataBinary = await Saver(wwaData);

    const result = decompressMapData(wwaDataBinary);
    const resultTextless = new WWADataExtractor(
        result.byteMapData,
        result.byteMapLength,
        new NodeEventEmitter()
    ).extractAllData();
    const resultWWAData = new TextLoader(
        resultTextless,
        wwaDataBinary,
        result.compressedEndPosition,
        new NodeEventEmitter
    ).load();

    expect(resultWWAData.message.length).toBe(resultWWAData.messageNum);
    expect(resultWWAData.objectAttribute.length).toBe(resultWWAData.objPartsMax);
    expect(resultWWAData.mapAttribute.length).toBe(resultWWAData.mapPartsMax);
    expect(resultWWAData.map.length).toBe(resultWWAData.mapWidth);
    expect(resultWWAData.mapObject.length).toBe(resultWWAData.mapWidth);

    expect(getMapSum(resultWWAData.map)).toBe(getMapSum(wwaData.map));
    expect(getMapSum(resultWWAData.mapObject)).toBe(getMapSum(wwaData.mapObject));

    expect(resultWWAData.worldName).toBe(wwaData.worldName);
    expect(resultWWAData.mapCGName).toBe(wwaData.mapCGName);
    expect(resultWWAData.charCGName).toBe(wwaData.charCGName);
    expect(resultWWAData.playerX).toBe(wwaData.playerX);
    expect(resultWWAData.playerY).toBe(wwaData.playerY);
    expect(resultWWAData.statusEnergy).toBe(wwaData.statusEnergy);
    expect(resultWWAData.statusEnergyMax).toBe(wwaData.statusEnergyMax);
    expect(resultWWAData.statusStrength).toBe(wwaData.statusStrength);
    expect(resultWWAData.statusDefence).toBe(wwaData.statusDefence);
    expect(resultWWAData.statusGold).toBe(wwaData.statusGold);
});

function getMapSum(map: number[][]): number {
    const makeSum = (sum: number, current: number) => sum + current;
    return map.map(mapLine => mapLine.reduce(makeSum)).reduce(makeSum);
}
