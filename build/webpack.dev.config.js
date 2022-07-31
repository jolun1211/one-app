const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const os = require("os");
const HappyPack = require("happypack");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const webpackMerge = require('webpack-merge');
const commonConfig = require("./webpack.common.config.js");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");


const exclude = [
  /node_modules/,
  path.join(__dirname, "../src/*/node_modules/**/*")
];
const srcDir = path.join(__dirname, "../src");
const baseConfig = (options) => Object.prototype.toString.call(commonConfig) === '[object Function]' ? commonConfig(null, options) : commonConfig
module.exports = (args, options) => {
  const devMode = options.dev;
  return merge(baseConfig(options), {
    devtool: "source-map",
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude,
        loader: "source-map-loader"
      }]
    },
    mode: "development",
    devServer: {
      port: 8099,
      hot: true,
      open: false,
      historyApiFallback: true,
      compress: true,
      proxy: {
        "/api": {
          target:
            "http://localhost:3000/",
          changeOrigin: true,
          secure: false,
          pathRewrite: { "^/api": "" }
        }
      }
    },
    plugins: [
      new CleanWebpackPlugin(),
    ],
  });
};