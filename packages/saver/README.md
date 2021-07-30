WWA Saver
===
インターネットRPG World Wide Adventure の JavaScript 実行環境 [WWA Wing](https://wwawing.com/) 内部で扱うデータを、 [WWA マップ作成ツール](https://wwajp.com/making.html) や WWA Maker で開けるマップデータファイルのバイナリデータに変換するプログラムです。

## テストについて
WWA Saver では Jest を導入していますが、テストの実行ファイルはまだ作成していません。

### バージョンの設定
`package.json` の Jest のバージョンは maker パッケージの Jest のバージョンと揃えるようにしてください。

maker パッケージの Jest は react-scripts の中にありますので、 react-scripts がバージョンアップしましたら、この saver にある Jest のバージョンも更新してください。

### メッセージ内容について
テストで使用されるサンプルデータのメッセージ内容については、 [キャラバンサークル](https://www.wwajp.com) の WWA ゲームのメッセージを使用しています。
