ここでは、WWAMakerのAPI仕様や変数一覧、アルゴリズムなどをまとめた仕様書を記す。

# 定数

## パーツ属性

| 定数名 | タイプ | 値 | 説明 |
| ------ | ------ | -- | ---- |
| OBJECT_NORMAL | number | 0 | 通常物体 |
| OBJECT_MESSAGE | number | 1 | メッセージ |
| OBJECT_URLGATE | number | 2 | URLゲート |
| OBJECT_STATUS | number | 3 | ステータス変化 |
| OBJECT_ITEM | number | 4 | アイテム |
| OBJECT_DOOR | number | 5 | 扉 |
| OBJECT_MONSTER | number | 6 | モンスター |
| OBJECT_SCORE | number | 11 | スコア表示 |
| OBJECT_SELL | number | 14 | 物を売る |
| OBJECT_BUY | number | 15 | 物を買う |
| OBJECT_RANDOM | number | 16 | ランダム選択 |
| OBJECT_SELECT | number | 17 | 二者択一 |
| OBJECT_LOCALGATE | number | 18 | ジャンプゲート |
| MAP_STREET | number | 0 | 道 |
| MAP_WALL | number | 1 | 壁 |
| MAP_LOCALGATE | number | 2 | ジャンプゲート |
| MAP_URLGATE | number | 4 | URLゲート |

### 欠番

 - OBJECT_DISP_PASS(12) - 用途不明
 - OBJECT_INPUT_PASS(13) - 用途不明
 - MAP_WORLDGATE(3) - 旧URLゲート？
 - MAP_ITEMCHECK(5) - アイテムに反応する背景パーツ？

# パーツクラス(Parts)

## インスタンス変数

| 変数名 | 参照範囲 | タイプ | 説明 |
| ------ | -------- | ------ | ---- |
| imageNo | - | number | 使用イメージの場所 |
| attribute | - | number | パーツの属性(参照の際は定数で) |
| appearParts | - | AppearParts[] | 指定位置にパーツを出現する条件の配列 |
| soundNo | - | number | サウンド番号 |
| waitTime | - | number | 待ち時間 |
| message | - | String | メッセージ |

# 物体パーツクラス(ObjParts)

## インスタンス変数

| 変数名 | 参照範囲 | タイプ | 説明 |
| ------ | -------- | ------ | ---- |
| imageAnimationNo | - | number | アニメーション用、もう1つの使用イメージの場所 |
| status | - | Status | モンスターやアイテムのステータス(必要なときにインスタンス化) |
| movingType | - | number | 動作属性(参照の際は定数で) |

# ステータスクラス(Status)

ステータスクラスでインスタンス化される物体パーツ属性は以下に通りである。

 - モンスター
 - アイテム
 - ステータス変化
 - 物を売る
 - 物を買う

## インスタンス変数

| 変数名 | 参照範囲 | タイプ | 説明 |
| ------ | -------- | ------ | ---- |
| energy | - | number | 生命力 |
| strength | - | number | 攻撃力 |
| defence | - | number | 防御力 |
| gold | - | number | 所持金 |

## インスタンス変数の扱い

 - モンスター
   - 生命力、攻撃力、防御力：モンスターの各ステータス
   - 所持金：モンスターを倒した後の所持金
 - アイテム
   - 生命力、所持金：未使用
   - 攻撃力、防御力：アイテム自体に備わっている各ステータス
 - ステータス変化
   - 生命力、攻撃力、防御力、所持金：触れた時に変化する各ステータス
 - 物を売る
   - 生命力、攻撃力、防御力：購入したことで上昇するステータス
   - 所持金：購入にかかるコスト