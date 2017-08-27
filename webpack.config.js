module.exports = {
  entry: './src/wwamk_main.ts',
  output: {
    filename: 'wwamk.long.js',
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
}