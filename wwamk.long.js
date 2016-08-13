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
var MAP_SIZE_MAXIMUM = 1001;
var OBJECT_PARTS_MAXIMUM = 4000;
var MAP_PARTS_MAXIMUM = 4000;
// データ読み込みの定数
var CHIP_WIDTH = 40; // 1マスの横幅
var CHIP_HEIGHT = 40; // 1マスの縦幅
var PARTS_ATTRIBUTE_NUMBER_ATTRIBUTE = 3; // Attribute配列の各配列のうち、属性を示す場所
var PARTS_ATTRIBUTE_NUMBER_MESSAGE = 5; // Attribute配列の各配列のうち、メッセージを示す場所
var PARTS_ATTRIBUTE_NUMBER_IMAGE_X = 6; // Attribute配列の各配列のうち、画像X位置を示す場所
var PARTS_ATTRIBUTE_NUMBER_IMAGE_Y = 7; // Attribute配列の各配列のうち、画像Y座標を示す場所
var PARTS_ATTRIBUTE_NUMBER_ANIMATION_X = 8; // Attribute配列の各配列のうち、アニメーション用画像X位置を示す場所
var PARTS_ATTRIBUTE_NUMBER_ANIMATION_Y = 9; // Attribute配列の各配列のうち、アニメーション用画像Y位置を示す場所
var PARTS_ATTRIBUTE_START_PARAMETERS = 10; // Attribute配列の各配列のうち、パラメータを示す開始場所
var PARTS_ATTRIBUTE_START_APPEAR = 20; // Attribute配列の各配列のうち、指定位置のパーツ出現を示す開始場所
var t_start; // 読み込み開始時間
var t_end; // 読み込み完了時間
var WWAMk = (function () {
    function WWAMk() {
        this.objectMap = new Array(MAP_SIZE_MAXIMUM);
        this.mapMap = new Array(MAP_SIZE_MAXIMUM);
        this.objectParts = new Array(OBJECT_PARTS_MAXIMUM);
        this.mapParts = new Array(MAP_PARTS_MAXIMUM);
    }
    WWAMk.prototype.setData = function (data) {
        this.worldName = data["worldName"];
        this.mapCGName = data["mapCGName"];
        this.playerX = data["playerX"];
        this.playerY = data["playerY"];
        this.gameoverX = data["gameoverX"];
        this.gameoverY = data["gameoverY"];
        this.statusEnergyMax = data["statusEnergyMax"];
        this.statusEnergy = data["statusEnergy"];
        this.statusStrength = data["statusStrength"];
        this.statusDefence = data["statusDefence"];
        this.statusGold = data["statusGold"];
        this.mapSize = data["mapWidth"];
        this.objectPartsMax = data["objPartsMax"];
        this.mapPartsMax = data["mapPartsMax"];
        for (var i = 0; i < this.mapSize; i++) {
            this.objectMap[i] = new Array(MAP_SIZE_MAXIMUM);
            this.mapMap[i] = new Array(MAP_SIZE_MAXIMUM);
            for (var j = 0; j < this.mapSize; j++) {
                /*
                 * マップをとりあえず作る
                 */
                this.objectMap[i][j] = data["mapObject"][i][j];
                this.mapMap[i][j] = data["map"][i][j];
            }
        }
        for (var i = 0; i < this.objectPartsMax; i++) {
            /*
             * パーツをとりあえず作る
             * ・どうしてそんなことが必要なの→foreach分は作ったパーツ分でしか反応しない(ただ数を設定しただけでは無視される)
             * ・条件について→今のパーツ最大数(objectPartsMax)未満
             */
            this.objectParts[i] = new ObjectParts();
        }
        var i = 0;
        this.objectParts.forEach(function (parts) {
            /*
             * 作ったパーツを順次代入
             * ・for文の中には入れないの→this.objectParts配列を書くのがすごくめんどい
             */
            if (data["objectAttribute"][i] == undefined) {
            }
            else {
                var messageNo = data["objectAttribute"][i][PARTS_ATTRIBUTE_NUMBER_MESSAGE];
                parts.message = data["message"][messageNo]; // メッセージ
                parts.imageX = data["objectAttribute"][i][PARTS_ATTRIBUTE_NUMBER_IMAGE_X] / CHIP_WIDTH;
                parts.imageY = data["objectAttribute"][i][PARTS_ATTRIBUTE_NUMBER_IMAGE_Y] / CHIP_HEIGHT;
                parts.imageAnimationX = data["objectAttribute"][i][PARTS_ATTRIBUTE_NUMBER_ANIMATION_X] / CHIP_WIDTH;
                parts.imageAnimationY = data["objectAttribute"][i][PARTS_ATTRIBUTE_NUMBER_ANIMATION_Y] / CHIP_HEIGHT;
                parts.attribute = data["objectAttribute"][i][PARTS_ATTRIBUTE_NUMBER_ATTRIBUTE];
                for (var j = 0; j < 10; j++) {
                    parts.parameters[j] = data["objectAttribute"][i][PARTS_ATTRIBUTE_START_PARAMETERS + j];
                }
                for (var j = 0; j < 10; j++) {
                    parts.appearParts[j] = new AppearParts(data["objectAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4)], // パーツ番号
                    data["objectAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4) + 3], // 物体 or 背景？
                    data["objectAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4) + 1], // X座標
                    data["objectAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4) + 2] // Y座標
                    );
                } // for
            } // else
            i++;
        });
        for (var i = 0; i < this.mapPartsMax; i++) {
            this.mapParts[i] = new MapParts();
        }
        var i = 0;
        this.mapParts.forEach(function (parts) {
            if (data["mapAttribute"][i] == undefined) {
            }
            else {
                var messageNo = data["mapAttribute"][i][PARTS_ATTRIBUTE_NUMBER_MESSAGE];
                parts.message = data["message"][messageNo];
                parts.imageX = data["mapAttribute"][i][PARTS_ATTRIBUTE_NUMBER_IMAGE_X] / CHIP_WIDTH;
                parts.imageY = data["mapAttribute"][i][PARTS_ATTRIBUTE_NUMBER_IMAGE_Y] / CHIP_HEIGHT;
                parts.attribute = data["mapAttribute"][i][PARTS_ATTRIBUTE_NUMBER_ATTRIBUTE];
                for (var j = 0; j < 10; j++) {
                    parts.parameters[j] = data["mapAttribute"][i][PARTS_ATTRIBUTE_START_PARAMETERS + j];
                }
                for (var j = 0; j < 10; j++) {
                    parts.appearParts[j] = new AppearParts(data["mapAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4)], data["mapAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4) + 3], data["mapAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4) + 1], data["mapAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4) + 2]);
                } // for
            } // else
            i++;
        });
    };
    WWAMk.prototype.drawmap = function () {
        var mapCanvasElement;
    }; // drawmap
    return WWAMk;
}()); // WWAMk
var SystemMessage = (function () {
    function SystemMessage() {
    }
    return SystemMessage;
}());
var postMessage_noWorker = messageHandler;
var wwaMk = new WWAMk();
var main = function () {
    t_start = new Date().getTime();
    var worker = new Worker("./wwaload.js"); // WebWorker作成
    worker.postMessage({ "fileName": "./" + EXTRACTING_MAPDATA_FILENAME }); // ファイルを持っていく
    worker.addEventListener("message", messageHandler); // messageHandlerへどぞ
};
var $id = function (id) {
    return document.getElementById(id);
};
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
        wwaMk.setData(e.data.wwaData);
        console.log(e.data.wwaData);
    }
};
var disp = function (data) {
    t_end = new Date().getTime();
    // 読み込んだデータをコンソール出力
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
