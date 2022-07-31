const path = require('path');
const merge = require('webpack-merge');
const baseConfig = {};
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const os = require("os");
const HappyPack = require("happypack");
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const HtmlWebpackPlugin = require("html-webpack-plugin");

const exclude = [
  /node_modules/,
  path.join(__dirname, "../src/*/node_modules/**/*")
];
const srcDir = path.join(__dirname, "../src");
console.log("路径", path.join(__dirname, '../src/index.tsx'))
module.exports = (args, options) => {
  const devMode = true || options.dev;
  return {
    entry: path.join(__dirname, '../src/index.tsx'),
    output: {
      path: path.resolve(__dirname, "../dist"),
      filename: "[name]-[chunkhash:8].js",
    },
    resolve: {
      modules: [srcDir, 'node_modules'],
      alias: {
        '@common/enums': path.join(
          __dirname,
          '../src/common/enums/'
        ),
        '@common/utils': path.join(
          __dirname,
          '../src/common/utils/index'
        ),

        '@http': path.join(
          __dirname,
          '../src/common/utils/http.ts'
        ),
        '@store': path.join(
          __dirname,
          '../src/store'
        ),
        '@pages/*': path.join(
          __dirname,
          '../src/pages/*'
        )
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.scss']
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude,
          include: [srcDir],
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /(\.ts)|(\.tsx)$/,
          exclude,
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        },
        {
          test: /\.less$/,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
            "less-loader"
          ]
        },
        {
          test: /\.css$/,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader"
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: ["url-loader"],
          include: [srcDir]
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          use: ["url-loader"],
          include: [srcDir]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: ["url-loader"],
          include: [srcDir]
        }
      ],

    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `../src/index.html`)
      }),
      // new webpack.NamedModulesPlugin(),
      // new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash:8].css",
        chunkFilename: "chunk/[id].[contenthash:8].css"
      }),
    ]
  }
};