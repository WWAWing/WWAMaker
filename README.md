WWA Maker
===

インターネットRPG World Wide Adventure (WWA) のマップ作成ツールです。 Windows アプリケーション「[WWA マップ作成ツール](https://wwajp.com/making.html)」を Electron と Web 技術によって作り直すことを目標としています。

作り直すことによって下記が実現されることを期待しています。

- Mac や Linux などの WWA マップ作成ツールが起動できない環境でも WWA ゲームが制作できる
- [WWA Wing](https://github.com/WWAWing/WWAWing) の新機能追加の自由度が高くなる

## 始めるには？
この WWA Maker には [yarn (1.x)](https://classic.yarnpkg.com/ja/) を利用しています。
yarn をインストールし、以下のコマンドを入力することで、 WWA Maker を実行することが出来ます。

現時点では、 [現行バージョンの yarn@berry](https://yarnpkg.com/) には未対応です (後ほど対応出来るように移行する予定です。) 。

```
yarn
yarn start
```

## 構造について
このリポジトリでは、 monorepo による複数パッケージの構成を取っています。
現時点では **maker** パッケージしか機能していませんが、後にパッケージを追加したり、他のパッケージも機能するように調整したりする予定です。

- **assets** ... アセットファイル (現在未使用)
- **maker** ... WWA Maker 本体

### より詳しい情報は
[GitHub のWiki](https://github.com/WWAWing/WWAMaker/wiki/) をご参照ください。

## できていないところ
下記の機能はまだ実装していません。後ほど実装予定です。

- 指定位置にパーツを出現
- パーツの削除機能
- 暗証番号の入力機能
- ファイルへの保存
- 枠線の表示
- Electron のインストールとデスクトップアプリケーション化 (現時点ではブラウザ上で動作していますが、最終的にはデスクトップアプリケーションでのみ動作するつもりでいます。)

下記の機能については、上記の機能の実装が終わり次第進めます。

- メッセージの検索機能
- リソース管理 (画像やサウンド)

## ライセンス
当プログラムは同梱しているWWALoader含めMITライセンスとします。

また、当プログラムに同梱しているサンプルの wwamap.dat と making.gif は[キャラバンサークル](http://www.wwajp.com)に従うものとします。
