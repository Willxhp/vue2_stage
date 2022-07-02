const path = require('path')
const HtmlWebapackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vue.js',
  },
  mode: 'development',
  devServer: {
    host: 'localhost',
    port: 8000,
    open: true,
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new HtmlWebapackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    })
  ]
}