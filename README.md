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
yarn build
yarn start
```

### マップデータの作成方法
現在テストプレイ機能を用意していませんが、編集したマップデータを保存することができます。

編集したマップデータを動かすには WWA Wing が必要です。予め [WWA Wing の完全版](https://wwawing.com/) をダウンロードしておくことをおすすめします。

1. ツールバーの新規作成 (紙のアイコン) から、空のマップデータを作成します。
    - イメージ画像は WWAWing から GIF 画像で取得できます
    - イメージ画像は `./packages/maker/public` に配置します
2. 物体パーツや背景パーツを作成します。
3. 作成したパーツをマップに配置します。
4. 満足するまで編集を続けます。
5. 編集が終わったらツールバーの保存 (フロッピーディスクのアイコン) から、マップデータを保存します。
6. 保存したマップデータを WWA Wing のディレクトリに移動します。
7. [WWA Wing のマニュアル](https://wwawing.com/wing/manual.html) の通りに WWA Wing に組み込みます。
8. 組み込んだ HTML ファイルをデバッグサーバー経由で起動します。

既存のマップデータを開く場合はイメージ画像含めて場所を `./packages/maker/public` に移動し、マップデータファイル名をツールバーの開く (フォルダのアイコンとテキストボックス) からそのまま入力して開きます。

## 構造について
このリポジトリでは、 monorepo による複数パッケージの構成を取っています。

- **app** ... Electron メインプロセス
- **assets** ... アセットファイル (現在未使用)
- **image-decorder** ... イメージデコーダー (base64 や objectURL などの画像の文字列データを `HTMLImageElement` といったイメージ要素に変換する Hooks)
- **maker** ... Electron レンダラープロセス
- **saver** ... WWA Saver (編集しているマップデータからファイルに出力する機能)

### より詳しい情報は
[GitHub のWiki](https://github.com/WWAWing/WWAMaker/wiki/) をご参照ください。

## できていないところ
下記の機能はまだ実装していません。後ほど実装予定です。

- 暗証番号の入力機能
- テストプレイ機能
- 終了時に保存するか確認する機能
- UNDO/REDO 機能
- パーツのコピー/ペースト機能

下記の機能については、上記の機能の実装が終わり次第進めます。

- メッセージの検索機能
- リソース管理 (画像やサウンド)
- マップの選択範囲のコピー/ペースト機能
- 戦闘結果予測機能

## ライセンス
当プログラムは同梱しているWWALoader含めMITライセンスとします。

また、当プログラムに同梱しているサンプルの wwamap.dat と making.gif は[キャラバンサークル](http://www.wwajp.com)に従うものとします。
