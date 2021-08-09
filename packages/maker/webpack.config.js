const path = require("path");
const webpack = require("webpack");

const enableSourceMap = true;

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  devtool: "source-map",
  target: "electron-renderer",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "resolve-url-loader",
            options: {
              sourceMap: enableSourceMap
            }
          },
        ]
      },
      {
        test: /(\.module)?\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "resolve-url-loader",
            options: {
              sourceMap: enableSourceMap
            }
          },
          "sass-loader"
        ]
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: "url-loader"
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".ts", ".tsx"],
    fallback: {
      module: false,
      dgram: false,
      dns:false,
      fs: false,
      http2: false,
      net: false,
      tls: false,
      child_process: false,
      path: false
    },
  },
  output: {
    path: path.resolve(__dirname, "build/"),
    publicPath: "/build/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, "public/"),
    port: 3000,
    publicPath: "http://localhost:3000/",
    hotOnly: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};
