import getPartsCount from "./getPartsCount";

test("128/200 の配列で 128 が返ってくる", () => {
    const partsAttribute = new Array(200).fill([0]).map((value, index) => {
        // パーツ番号 128 番以降は空のまま
        if (index < 128) {
            return [index];
        } else {
            return [0];
        }
    });
    expect(getPartsCount(partsAttribute)).toBe(128);
});

test("パーツ属性情報のない配列で 1 が返ってくる", () => {
    const partsAttribute = new Array(100).fill([0]);
    expect(getPartsCount(partsAttribute)).toBe(1);
});
