const gulp = require('gulp');
const webpack = require('webpack');
const basicDevWebpackConfig = require('./webpack.dev.config');
const webpackMerge = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const path = require('path');
const fs = require('fs');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { isSinglePage, mergePackagesWebpackConfig, getPageConfig, validatePackages } = require('./gulpfile.util');

if (!validatePackages()) {
  return;
}

const { pageName, pageList, sourcePageList } = getPageConfig();

function runDev() {
  const mode = { mode: 'development' };
  const pageWebpackConfig = mergePackagesWebpackConfig(pageList, mode);
  const webpackConfig = webpackMerge(
    Object.prototype.toString.call(basicDevWebpackConfig) === '[object Function]' ? basicDevWebpackConfig(null, mode) : basicDevWebpackConfig,
    pageWebpackConfig, mode);
  const compiler = webpack(webpackConfig);

  new ForkTsCheckerWebpackPlugin({
    tsconfig:  `../tsconfig.build.json`,
  }).apply(compiler);

  const defaultServer = {
    contentBase: path.join(__dirname, '../dist'),
    compress: true,
    open: true,
    index: 'index.html',
    setup: app => {
      app.post('*', (req, res) => {
        res.redirect(req.url);
      });
    }
  };
  const server = isSinglePage(pageName) ? webpackMerge(defaultServer, pageWebpackConfig.devServer) : defaultServer;

  new WebpackDevServer(compiler, server).listen(8095, 'localhost', () => {
    console.log('dev server listening on port 8095');
  });
}

gulp.task('runDev', gulp.series(
  prehook,
  buildTsConfig,
  runDev
));

async function buildTsConfig() {
  const baseTsConfig = JSON.parse(fs.readFileSync('../tsconfig.base.json'));
  
  let config = baseTsConfig;
  config.compilerOptions.paths = { ...baseTsConfig.compilerOptions.paths };

  fs.writeFileSync('../tsconfig.build.json', JSON.stringify(config, null, 2));
}

gulp.task('buildTsConfig', buildTsConfig);

function prehook() {
  return gulp.src(['../.git-hooks/*'])
    .pipe(gulp.dest('../.git/hooks/'));
}