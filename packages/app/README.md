WWA Maker Electron アプリケーション
===

このパッケージは Electron アプリケーションのメインプロセス部分を担うソースファイルが含まれています。

レンダラープロセス部分は `maker` パッケージをご確認ください。

## スクリプト一覧
- `electron`: Electron を起動します。
- `start`: 現在未使用です。
    - electron-webpack を使用して起動できないか模索していましたが、現時点では実装が難しそうです。
- `build`: TypeScript ソースファイルをコンパイルし、 Electron から実行可能なソースファイルを生成します。
