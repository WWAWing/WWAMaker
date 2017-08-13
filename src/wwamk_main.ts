/// <reference path="wwamk_parts.ts" />
/// <reference path="wwamk_data.ts" />

const EXTRACTING_MAPDATA_FILENAME:string = "wwamap.dat"; // 吸い出すファイル名
const MAP_SIZE_MAXIMUM:number = 1001;
const OBJECT_PARTS_MAXIMUM:number = 4000;
const MAP_PARTS_MAXIMUM:number = 4000;
const SYSTEM_MESSAGE_MAXIMUM:number = 20;

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
const CANVAS_ELEMENT_ID: string = "wm_mapCanvas";
const CANVAS_OBJECT_ELEMENT_ID: string = "wm_parts_list_Obj_map";
const CANVAS_BACK_ELEMENT_ID: string = "wm_parts_list_Back_map";

var t_start: number; // 読み込み開始時間
var t_end: number; // 読み込み完了時間

class WWAMk{
    private _cvs: HTMLCanvasElement;
    private _cvsObject: HTMLCanvasElement;
    private _cvsBack: HTMLCanvasElement;

    private _wwamkData: wwamk_data.WWAData;
    private _image: HTMLImageElement;
    constructor(){
        this._cvs = <HTMLCanvasElement>document.getElementById(CANVAS_ELEMENT_ID);
        this._cvsObject = <HTMLCanvasElement>document.getElementById(CANVAS_OBJECT_ELEMENT_ID);
        this._cvsBack = <HTMLCanvasElement>document.getElementById(CANVAS_BACK_ELEMENT_ID);
    }
    setData(data): void{ // WWALoaderから持ってきたデータをクラスの各インスタンス変数に代入します
        this._wwamkData = new wwamk_data.WWAData();
        this._wwamkData.worldName = data["worldName"];
        this._wwamkData.mapCGName = data["mapCGName"];
        this._wwamkData.playerX = data["playerX"];
        this._wwamkData.playerY = data["playerY"];
        this._wwamkData.gameoverX = data["gameoverX"];
        this._wwamkData.gameoverY = data["gameoverY"];
        this._wwamkData.statusEnergyMax = data["statusEnergyMax"];
        this._wwamkData.statusEnergy = data["statusEnergy"];
        this._wwamkData.statusStrength = data["statusStrength"];
        this._wwamkData.statusDefence = data["statusDefence"];
        this._wwamkData.statusGold = data["statusGold"];
        this._wwamkData.mapSize = data["mapWidth"];
        this._wwamkData.objectPartsMax = data["objPartsMax"];
        this._wwamkData.mapPartsMax = data["mapPartsMax"];

        for(var i: number = 0; i < this._wwamkData.mapSize; i++) {
            this._wwamkData.objectMap[i] = new Array(MAP_SIZE_MAXIMUM);
            this._wwamkData.mapMap[i] = new Array(MAP_SIZE_MAXIMUM);
            for(var j: number = 0; j < this._wwamkData.mapSize; j++) {
                /*
                 * マップをとりあえず作る
                 */
                this._wwamkData.objectMap[i][j] = data["mapObject"][i][j];
                this._wwamkData.mapMap[i][j] = data["map"][i][j];
            }
        }
        for(var i: number = 0; i < this._wwamkData.objectPartsMax; i++) {
            /*
             * パーツをとりあえず作る
             * ・どうしてそんなことが必要なの→foreach分は作ったパーツ分でしか反応しない(ただ数を設定しただけでは無視される)
             * ・条件について→今のパーツ最大数(objectPartsMax)未満
             */
            this._wwamkData.objectParts[i] = new ObjectParts();
        }
        var i: number = 0;
        this._wwamkData.objectParts.forEach(parts => {
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
        for(var i: number = 0; i < this._wwamkData.mapPartsMax; i++) {
            this._wwamkData.mapParts[i] = new MapParts();
        }
        var i: number = 0;
        this._wwamkData.mapParts.forEach(parts => {
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
        this._image = new Image();
        this._image.src = this._wwamkData.mapCGName;
        this._cvs.width = this._wwamkData.mapSize * CHIP_WIDTH;
        this._cvs.height = this._wwamkData.mapSize * CHIP_HEIGHT;

        this._cvsObject.height = Math.ceil(this._wwamkData.objectPartsMax / 10) * CHIP_HEIGHT;
        this._cvsBack.height = Math.ceil(this._wwamkData.mapPartsMax / 10) * CHIP_HEIGHT;
        var ctxObject = <CanvasRenderingContext2D>this._cvsObject.getContext('2d');
        this._wwamkData.objectParts.forEach((parts, i) => {
            ctxObject.drawImage(this._image,
                parts.imageX * CHIP_WIDTH, parts.imageY * CHIP_HEIGHT, CHIP_WIDTH, CHIP_HEIGHT,
                (i % 10) * CHIP_WIDTH, Math.floor(i / 10) * CHIP_HEIGHT, CHIP_WIDTH, CHIP_HEIGHT);
        });
        var ctxBack = <CanvasRenderingContext2D>this._cvsBack.getContext('2d');
        this._wwamkData.mapParts.forEach((parts, i) => {
            ctxBack.drawImage(this._image,
                parts.imageX * CHIP_WIDTH, parts.imageY * CHIP_HEIGHT, CHIP_WIDTH, CHIP_HEIGHT,
                (i % 10) * CHIP_WIDTH, Math.floor(i / 10) * CHIP_HEIGHT, CHIP_WIDTH, CHIP_HEIGHT);
        });
    }
    drawmap(): void{
        var ctx = <CanvasRenderingContext2D>this._cvs.getContext('2d');
        
        for (var y = 0; y < this._wwamkData.mapSize; y++) {
            for (var x = 0; x < this._wwamkData.mapSize; x++) {
                var clipX, clipY;
                clipX = this._wwamkData.mapParts[this._wwamkData.mapMap[y][x]].imageX;
                clipY = this._wwamkData.mapParts[this._wwamkData.mapMap[y][x]].imageY;
                //console.log(this._wwamkData.mapMap[y][x], clipX, clipY);
                ctx.drawImage(this._image,
                    clipX * CHIP_WIDTH, clipY * CHIP_HEIGHT, CHIP_WIDTH, CHIP_HEIGHT,
                    x * CHIP_WIDTH, y * CHIP_HEIGHT, CHIP_WIDTH, CHIP_HEIGHT);
                if (this._wwamkData.objectMap[y][x] != 0) {
                    clipX = this._wwamkData.objectParts[this._wwamkData.objectMap[y][x]].imageX;
                    clipY = this._wwamkData.objectParts[this._wwamkData.objectMap[y][x]].imageY;
                    ctx.drawImage(this._image,
                        clipX * CHIP_WIDTH, clipY * CHIP_HEIGHT, CHIP_WIDTH, CHIP_HEIGHT,
                        x * CHIP_WIDTH, y * CHIP_HEIGHT, CHIP_WIDTH, CHIP_HEIGHT);
                }
            }
        }
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
var wwaMk: WWAMk;

var main = function () {
    t_start = new Date().getTime();
    wwaMk = new WWAMk();

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
        wwaMk.drawmap();
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
