import getMapWidth from "./getMapWidth";

test("マップサイズが圧縮されている", () => {
    const map = new Array(201).fill(new Array(201).fill(0));
    const mapObject = new Array(201).fill(new Array(201).fill(0));
    
    const result = getMapWidth(map, mapObject);
    expect(result).toBe(101);
});
