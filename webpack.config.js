const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: path.resolve(__dirname, "src", "js", "main.js"),
  output:{
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  mode: "development",
  plugins: [new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "src","index.html"),
  })],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist")
    },
    port: 3000,
    open: true,
    liveReload: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
        exclude: "/node_modules"
      },
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      }
    ]
  }
}