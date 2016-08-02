/// <reference path="wwamk_parts.ts" />

const EXTRACTING_MAPDATA_FILENAME:string = "wwamap.dat"; // 吸い出すファイル名

var t_start: number; // 読み込み開始時間
var t_end: number; // 読み込み完了時間
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
        disp(e.data.wwaData);
    }
}


var postMessage_noWorker = messageHandler;

var main = function () {
    t_start = new Date().getTime();
    var worker = new Worker("./wwaload.js"); // WebWorker作成
    worker.postMessage({ "fileName": "./" + EXTRACTING_MAPDATA_FILENAME }); // ファイルを持っていく
    worker.addEventListener("message", messageHandler); // messageHandlerへどぞ
}

var $id = function (id) {
    return document.getElementById(id);
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
        } catch (e) {
            throw new Error("Display Error!! index: " + key);
        }
    }

}

window.addEventListener("load", function () {
    main();
});
