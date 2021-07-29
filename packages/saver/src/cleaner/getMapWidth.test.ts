import getMapWidth from "./getMapWidth";

test("101/201 マップが圧縮されている", () => {
    const WIDTH = 201;
    const map = new Array(WIDTH).fill(new Array(WIDTH).fill(0).map((value, x) => {
        if (x < 101) {
            return 1;
        }
        return value;
    })).map((value, y) => {
        if (y < 101) {
            return value;
        }
        return new Array(WIDTH).fill(0);
    });
    const mapObject = new Array(WIDTH).fill(new Array(WIDTH).fill(0).map((value, x) => {
        if (x < 101 && x / 2 == 0) {
            return 1;
        }
        return value;
    })).map((value, y) => {
        if (y < 101) {
            return value;
        }
        return new Array(WIDTH).fill(0);
    });
    
    const newWidth = getMapWidth(map, mapObject);
    expect(newWidth).toBe(101);
    // 圧縮が目的のため、実行時に返されたマップサイズは同じか小さくなくてはならない
    expect(newWidth).toBeLessThanOrEqual(WIDTH);
});

test("非正方形 (115,78/301) のマップが圧縮されている", () => {
    const WIDTH = 301;
    const map = new Array(WIDTH).fill(new Array(WIDTH).fill(0).map((value, x) => {
        if (x < 115) {
            return 1;
        }
        return value;
    })).map((value, y) => {
        if (y < 78) {
            return value;
        }
        return new Array(WIDTH).fill(0);
    });
    const mapObject = new Array(WIDTH).fill(new Array(WIDTH).fill(0).map((value, x) => {
        if (x < 115 && x / 2 == 0) {
            return 1;
        }
        return value;
    })).map((value, y) => {
        if (y < 78) {
            return value;
        }
        return new Array(WIDTH).fill(0);
    });

    const newWidth = getMapWidth(map, mapObject);
    expect(newWidth).toBe(151);
    expect(newWidth).toBeLessThanOrEqual(WIDTH);
});

test("空のマップで 101 が出力される", () => {
    // 101 未満にした場合、実際の配列のサイズが 101 ( getMapWidth が返す最小値の値) を下回り、テストに失敗します。
    // 足りない分を補填する処理は getMapWidth 及びその関連メソッドにはないので、その分は cleaner 内の処理にお任せすることになります。
    const map = new Array(101).fill(new Array(101).fill(0));

    const newWidth = getMapWidth(map, map);
    expect(newWidth).toBe(101);
    expect(newWidth).toBeLessThanOrEqual(map.length);
});
