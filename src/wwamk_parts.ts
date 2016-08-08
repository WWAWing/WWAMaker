const OBJECT_NORMAL: number = 0; // 通常物体
const OBJECT_MESSAGE: number = 1; // メッセージ
const OBJECT_URLGATE: number = 2; // URLゲート
const OBJECT_STATUS: number = 3; // ステータス変化
const OBJECT_ITEM: number = 4; // アイテム
const OBJECT_DOOR: number = 5; // 扉
const OBJECT_MONSTER: number = 6; // モンスター
const OBJECT_SCORE: number = 11; // スコア表示
const OBJECT_SELL: number = 14; // 物を売る
const OBJECT_BUY: number = 15; // 物を買う
const OBJECT_RANDOM: number = 16; // ランダム選択
const OBJECT_SELECT: number = 17; // 二者択一
const OBJECT_LOCALGATE: number = 18; // ジャンプゲート

const MAP_STREET: number = 0; // 道
const MAP_WALL: number = 1; // 壁
const MAP_LOCALGATE: number = 2; // ジャンプゲート
const MAP_URLGATE: number = 4; // URLゲート

const PARTS_PARAMETERS_MAX: number = 10;

class Parts{
	imageX: number;
	imageY: number;
	attribute: number;
	appearParts: AppearParts[] = new Array(10); //  話しかける時に配置されるパーツ一覧
	parameters: number[] = new Array(PARTS_PARAMETERS_MAX); // パラメータ
	message: string;
}

class ObjectParts extends Parts{
	imageAnimationX: number;
	imageAnimationY: number;
}

class MapParts extends Parts{

}

class AppearParts{
	partsNo: number;
	partsType: number;
	X: number;
	Y: number;
	constructor(partsNo: number, partsType: number, X: number, Y: number){
		this.partsNo = partsNo;
		this.partsType = partsType;
		this.X = X;
		this.Y = Y;
	}
}