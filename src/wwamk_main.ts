/// <reference path="wwamk_parts.ts" />

const EXTRACTING_MAPDATA_FILENAME:string = "wwamap.dat"; // 吸い出すファイル名
const MAP_SIZE_MAXIMUM:number = 1001;
const OBJECT_PARTS_MAXIMUM:number = 4000;
const MAP_PARTS_MAXIMUM:number = 4000;

// データ読み込みの定数
const CHIP_WIDTH: number = 40; // 1マスの横幅
const CHIP_HEIGHT: number = 40; // 1マスの縦幅
const PARTS_ATTRIBUTE_NUMBER_ATTRIBUTE: number = 3; // Attribute配列の各配列のうち、属性を示す場所
const PARTS_ATTRIBUTE_NUMBER_MESSAGE: number = 5; // Attribute配列の各配列のうち、メッセージを示す場所
const PARTS_ATTRIBUTE_NUMBER_IMAGE_X: number = 6; // Attribute配列の各配列のうち、画像X位置を示す場所
const PARTS_ATTRIBUTE_NUMBER_IMAGE_Y: number = 7; // Attribute配列の各配列のうち、画像Y座標を示す場所
const PARTS_ATTRIBUTE_NUMBER_ANIMATION_X: number = 8; // Attribute配列の各配列のうち、アニメーション用画像X位置を示す場所
const PARTS_ATTRIBUTE_NUMBER_ANIMATION_Y: number = 9; // Attribute配列の各配列のうち、アニメーション用画像Y位置を示す場所
const PARTS_ATTRIBUTE_START_PARAMETERS: number = 10; // Attribute配列の各配列のうち、パラメータを示す開始場所
const PARTS_ATTRIBUTE_START_APPEAR: number = 20; // Attribute配列の各配列のうち、指定位置のパーツ出現を示す開始場所

var t_start: number; // 読み込み開始時間
var t_end: number; // 読み込み完了時間

class WWAMk{
    worldName: string;
    mapCGName: string;
    playerX: number;
    playerY: number;
    gameoverX: number;
    gameoverY: number;
    statusEnergyMax: number;
    statusEnergy: number;
    statusStrength: number;
    statusDefence: number;
    statusGold: number;
    mapSize: number;
    objectPartsMax: number;
    mapPartsMax: number;
    systemMessage: SystemMessage;
    objectMap: number[][] = new Array(MAP_SIZE_MAXIMUM);
    mapMap: number[][] = new Array(MAP_SIZE_MAXIMUM);
    objectParts:ObjectParts[] = new Array(OBJECT_PARTS_MAXIMUM);
    mapParts:MapParts[] = new Array(MAP_PARTS_MAXIMUM);
    constructor(){

    }
    setData(data): void{ // WWALoaderから持ってきたデータをクラスの各インスタンス変数に代入します
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
        for(var i: number = 0; i < this.mapSize; i++) {
            this.objectMap[i] = new Array(MAP_SIZE_MAXIMUM);
            this.mapMap[i] = new Array(MAP_SIZE_MAXIMUM);
            for(var j: number = 0; j < this.mapSize; j++) {
                /*
                 * マップをとりあえず作る
                 */
                this.objectMap[i][j] = data["mapObject"][i][j];
                this.mapMap[i][j] = data["map"][i][j];
            }
        }
        for(var i: number = 0; i < this.objectPartsMax; i++) {
            /*
             * パーツをとりあえず作る
             * ・どうしてそんなことが必要なの→foreach分は作ったパーツ分でしか反応しない(ただ数を設定しただけでは無視される)
             * ・条件について→今のパーツ最大数(objectPartsMax)未満
             */
            this.objectParts[i] = new ObjectParts();
        }
        var i: number = 0;
        this.objectParts.forEach(parts => {
            /*
             * 作ったパーツを順次代入
             * ・for文の中には入れないの→this.objectParts配列を書くのがすごくめんどい
             */
            if(data["objectAttribute"][i] == undefined) {
                // パーツが何も定義されていない場合は...
            } else {
                var messageNo: number = data["objectAttribute"][i][PARTS_ATTRIBUTE_NUMBER_MESSAGE];
                parts.message = data["message"][messageNo]; // メッセージ
                parts.imageX = data["objectAttribute"][i][PARTS_ATTRIBUTE_NUMBER_IMAGE_X] / CHIP_WIDTH;
                parts.imageY = data["objectAttribute"][i][PARTS_ATTRIBUTE_NUMBER_IMAGE_Y] / CHIP_HEIGHT;
                parts.imageAnimationX = data["objectAttribute"][i][PARTS_ATTRIBUTE_NUMBER_ANIMATION_X] / CHIP_WIDTH;
                parts.imageAnimationY = data["objectAttribute"][i][PARTS_ATTRIBUTE_NUMBER_ANIMATION_Y] / CHIP_HEIGHT;
                parts.attribute = data["objectAttribute"][i][PARTS_ATTRIBUTE_NUMBER_ATTRIBUTE];
                for(var j: number = 0; j < 10; j++) { // パラメータ読み込み
                    parts.parameters[j] = data["objectAttribute"][i][PARTS_ATTRIBUTE_START_PARAMETERS + j];
                }
                for(var j: number = 0; j < 10; j++) { // 指定位置にパーツを出現読み込み
                    parts.appearParts[j] = new AppearParts(
                        data["objectAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4)], // パーツ番号
                        data["objectAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4) + 3], // 物体 or 背景？
                        data["objectAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4) + 1], // X座標
                        data["objectAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4) + 2] // Y座標
                    );
                } // for
            } // else
            i++; 
        });
        for(var i: number = 0; i < this.mapPartsMax; i++) {
            this.mapParts[i] = new MapParts();
        }
        var i: number = 0;
        this.mapParts.forEach(parts => {
            if(data["mapAttribute"][i] == undefined) {

            } else {
                var messageNo: number = data["mapAttribute"][i][PARTS_ATTRIBUTE_NUMBER_MESSAGE];
                parts.message = data["message"][messageNo];
                parts.imageX = data["mapAttribute"][i][PARTS_ATTRIBUTE_NUMBER_IMAGE_X] / CHIP_WIDTH;
                parts.imageY = data["mapAttribute"][i][PARTS_ATTRIBUTE_NUMBER_IMAGE_Y] / CHIP_HEIGHT;
                parts.attribute = data["mapAttribute"][i][PARTS_ATTRIBUTE_NUMBER_ATTRIBUTE];
                for(var j: number = 0; j < 10; j++) {
                    parts.parameters[j] = data["mapAttribute"][i][PARTS_ATTRIBUTE_START_PARAMETERS + j];
                }
                for(var j: number = 0; j < 10; j++) {
                    parts.appearParts[j] = new AppearParts(
                        data["mapAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4)],
                        data["mapAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4) + 3],
                        data["mapAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4) + 1],
                        data["mapAttribute"][i][PARTS_ATTRIBUTE_START_APPEAR + (j * 4) + 2]
                    );
                } // for
            } // else
            i++;
        });
    }
    drawmap(): void{
        var mapCanvasElement: HTMLCanvasElement;
        
    } // drawmap
} // WWAMk

class SystemMessage{
    linkMessage: string;
    notHaveGoldMessage: string;
    notHaveItemMessage: string;
    useItemMessage: string;
    getClickableItemMessage: string;
    limitItemMessage: string;
    soundMessage: string;
}

var postMessage_noWorker = messageHandler;
var wwaMk: WWAMk = new WWAMk();

var main = function () {
    t_start = new Date().getTime();
    var worker = new Worker("./wwaload.js"); // WebWorker作成
    worker.postMessage({ "fileName": "./" + EXTRACTING_MAPDATA_FILENAME }); // ファイルを持っていく
    worker.addEventListener("message", messageHandler); // messageHandlerへどぞ
}

var $id = function (id) {
    return document.getElementById(id);
};

var messageHandler = function (e) {
    if (e.data.error !== null && e.data.error !== void 0) {
        try {
            alert(e.data.error.message);
        } catch (e) {
            alert("エラーの表示に失敗しました。");
        }
    } else if (e.data.progress !== null && e.data.progress !== null) {
        ($id("progressCurrent")).setAttribute("value", e.data.progress.current);
        ($id("progressTotal")).setAttribute("value", e.data.progress.total);
        ($id("progressStage")).setAttribute("value", e.data.progress.stage);
    } else {
        wwaMk.setData(e.data.wwaData);
        console.log(e.data.wwaData);
    }
}

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
        } catch (e) {
            throw new Error("Display Error!! index: " + key);
        }
    }

}

window.addEventListener("load", function () {
    main();
});
