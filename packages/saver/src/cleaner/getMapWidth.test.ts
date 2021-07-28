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
    
    expect(getMapWidth(map, mapObject)).toBe(101);
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

    expect(getMapWidth(map, mapObject)).toBe(151);
});

test("空のマップで 0 が出力される", () => {
    const map = new Array(101).fill(new Array(101).fill(0));
    expect(getMapWidth(map, map)).toBe(0);
});
