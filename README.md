WWA Maker
===

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

## ライセンス
当プログラムは同梱しているWWALoader含めMITライセンスとします。

また、当プログラムに同梱しているサンプルのwwamap.datは[キャラバンサークル](http://www.wwajp.com)に従うものとします。
