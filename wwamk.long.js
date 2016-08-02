var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OBJECT_NORMAL = 0; // 通常物体
var OBJECT_MESSAGE = 1; // メッセージ
var OBJECT_URLGATE = 2; // URLゲート
var OBJECT_STATUS = 3; // ステータス変化
var OBJECT_ITEM = 4; // アイテム
var OBJECT_DOOR = 5; // 扉
var OBJECT_MONSTER = 6; // モンスター
var OBJECT_SCORE = 11; // スコア表示
var OBJECT_SELL = 14; // 物を売る
var OBJECT_BUY = 15; // 物を買う
var OBJECT_RANDOM = 16; // ランダム選択
var OBJECT_SELECT = 17; // 二者択一
var OBJECT_LOCALGATE = 18; // ジャンプゲート
var MAP_STREET = 0; // 道
var MAP_WALL = 1; // 壁
var MAP_LOCALGATE = 2; // ジャンプゲート
var MAP_URLGATE = 4; // URLゲート
var PARTS_PARAMETERS_MAX = 10;
var Parts = (function () {
    function Parts() {
        this.appearParts = new Array(10); //  話しかける時に配置されるパーツ一覧
        this.parameters = new Array(PARTS_PARAMETERS_MAX); // パラメータ
    }
    return Parts;
}());
var ObjectParts = (function (_super) {
    __extends(ObjectParts, _super);
    function ObjectParts() {
        _super.apply(this, arguments);
    }
    return ObjectParts;
}(Parts));
var MapParts = (function (_super) {
    __extends(MapParts, _super);
    function MapParts() {
        _super.apply(this, arguments);
    }
    return MapParts;
}(Parts));
var AppearParts = (function () {
    function AppearParts(partsNo, partsType, X, Y) {
        this.partsNo = partsNo;
        this.partsType = partsType;
        this.X = X;
        this.Y = Y;
    }
    return AppearParts;
}());
/// <reference path="wwamk_parts.ts" />
var EXTRACTING_MAPDATA_FILENAME = "wwamap.dat"; // 吸い出すファイル名
var t_start; // 読み込み開始時間
var t_end; // 読み込み完了時間
var messageHandler = function (e) {
    if (e.data.error !== null && e.data.error !== void 0) {
        try {
            alert(e.data.error.message);
        }
        catch (e) {
            alert("エラーの表示に失敗しました。");
        }
    }
    else if (e.data.progress !== null && e.data.progress !== null) {
        ($id("progressCurrent")).setAttribute("value", e.data.progress.current);
        ($id("progressTotal")).setAttribute("value", e.data.progress.total);
        ($id("progressStage")).setAttribute("value", e.data.progress.stage);
    }
    else {
        disp(e.data.wwaData);
    }
};
var postMessage_noWorker = messageHandler;
var main = function () {
    t_start = new Date().getTime();
    var worker = new Worker("./wwaload.js");
    worker.postMessage({ "fileName": "./" + EXTRACTING_MAPDATA_FILENAME });
    worker.addEventListener("message", messageHandler);
};
var $id = function (id) {
    return document.getElementById(id);
};
var disp = function (data) {
    t_end = new Date().getTime();
    console.log(data);
    console.log("Load Complete! Loading Time is:" + (t_end - t_start));
    var ids = [
        "playerX",
        "playerY",
        "gameoverX",
        "gameoverY",
        "mapPartsMax",
        "objPartsMax",
        "statusEnergyMax",
        "statusEnergy",
        "statusStrength",
        "statusDefence",
        "statusGold",
        "mapWidth",
        "messageNum",
        "worldName",
        "mapCGName"
    ];
    for (var i in ids) {
        var key = ids[i];
        try {
            ($id(key)).setAttribute("value", data[key]);
        }
        catch (e) {
            throw new Error("Display Error!! index: " + key);
        }
    }
};
window.addEventListener("load", function () {
    main();
});
