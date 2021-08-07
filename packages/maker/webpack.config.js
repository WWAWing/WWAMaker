const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      },
      {
        test: /(\.module)?\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  },
  resolve: { extensions: ["*", ".ts", ".tsx"] },
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
