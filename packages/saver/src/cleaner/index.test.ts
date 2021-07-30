import { WWAData } from "@wwawing/common-interface";
import clean from ".";
import { WWAConsts } from "../utils/wwa_data";

test("使用されていないメッセージが削除されている", () => {
    const data = {
        objectAttribute: [
            [0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 10],
            [2, 0, 0, 0, 0, 14],
            [3, 0, 0, 0, 0, 16]
        ],
        mapAttribute: [
            [0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 11],
            [2, 0, 0, 0, 0, 13],
            [3, 0, 0, 0, 0, 15]
        ],
        message: [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "あいうえお",
            "ほげほげ",
            "使われてないメッセージです",
            "「カニカニーッ」\n怪物の雄叫びが聞こえる。\nこの奥にメビウスストーンが・・・",
            "ブクブク・・・",
            "骸骨の騎士\n「よく、ここまで来たな。\nかくなるうえは、\nこの俺が直々に相手をしてやろう。\nさあ来いっ！」",
            "うう・・・俺を倒したぐらいで、\nいい気になるなよ・・・"
        ],
        map: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        mapObject: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ]
    } as WWAData;

    const cleanedData = clean(data);
    // 「使われてないメッセージです」が消えている
    expect(cleanedData.message.length).toBe(16);
    expect(cleanedData.messageNum).toBe(16);
    expect(cleanedData.message).not.toContain("使われてないメッセージです");
    // 3番以降のメッセージの参照が変わっている
    expect(cleanedData.objectAttribute[1][WWAConsts.ATR_STRING]).toBe(10);
    expect(cleanedData.objectAttribute[2][WWAConsts.ATR_STRING]).toBe(14 - 1);
    expect(cleanedData.objectAttribute[3][WWAConsts.ATR_STRING]).toBe(16 - 1);
    expect(cleanedData.mapAttribute[1][WWAConsts.ATR_STRING]).toBe(11);
    expect(cleanedData.mapAttribute[2][WWAConsts.ATR_STRING]).toBe(13 - 1);
    expect(cleanedData.mapAttribute[3][WWAConsts.ATR_STRING]).toBe(15 - 1);
    // マップサイズについては getMapWidth.test.ts をご参照ください
});
