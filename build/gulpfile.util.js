const gulp = require('gulp');
const webpackMerge = require('webpack-merge');
const filesExist = require('files-exist');
const chalk = require('chalk');
const concat = require('gulp-concat');
const argv = require('yargs').argv;
const execa = require('execa');
const os = require('os');
const replace = require('gulp-replace');
var uglifyJs = require('gulp-uglify');
var uglifyCss = require('gulp-uglifycss');
var nop = require('gulp-nop');

function getPackages() {
  const package = execa.sync('lerna', ['list']);
  const packageList = package.stdout.split('\n');
  const packages = packageList.filter(item =>
    !item.includes('@core/')
  ).map(item => {
    return item.replace(/^@[^/]+\//, '');
  }).filter(item => !item.includes('spa'));

  return packages;
}

function isAllPage(pageName) {
  return typeof pageName === 'boolean';
}

function isSinglePage(pageName) {
  return pageName && !isAllPage(pageName) && !pageName.includes(',');
}

function isSpa(pageName) {
  return pageName === 'spa';
}

function isFilesExist(paths) {
  return filesExist(paths, {
    onMissing: function (file) {
      console.log('File not found: ' + file);
      return false;
    }
  });
}

function filesExistDoCopy(sourcePath, targetPath) {
  isFilesExist(sourcePath).length &&
    gulp.src(sourcePath)
      .pipe(gulp.dest(targetPath));
}

function filesExistDoPush(list, path) {
  if (path instanceof Array) {
    isFilesExist(path).length && list.push(...path);
  } else {
    isFilesExist(path).length && list.push(path);
  }

  return list;
}

function filesExistDoConcatCopy(sourcePath, targetPath, concatName) {
  const isJS = concatName.endsWith('.js');
  const pathAddon = (!isJS && Array(targetPath.split('/').length - 2).fill('..').join('/'));
  isFilesExist(sourcePath).length &&
    gulp.src(sourcePath)
      .pipe(isJS ? uglifyJs() : nop())
      .pipe(!isJS ? replace(/(url\()(["']?)([.\/]*?)\/?sources\//gi, `$1$2${pathAddon}/sources/`) : nop())
      .pipe(!isJS ? uglifyCss() : nop())
      .pipe(concat(concatName))
      .pipe(gulp.dest(targetPath));
}

function mergePackagesWebpackConfig(pageList, mode) {
  const webpackConfig = pageList.reduce((accumulator, currentPage) => {
    const module = require(`../packages/${currentPage}/build/webpack.config`);
    return webpackMerge(accumulator, Object.prototype.toString.call(module) === '[object Function]' ? module(null, mode) : module);
  }, {});

  return webpackConfig;
}

function getPageConfig() {
  const pageName = argv.page;
  const packages = getPackages();
  let pageList = packages || [];
  const sourcePageList = pageList;

  if (pageName) {
    pageList = isAllPage(pageName) ? pageList : pageName.split(',');
  }

  return { pageName, pageList, sourcePageList };
}

function validatePackages() {
  const packages = getPackages();
  if (packages &&
    packages instanceof Array &&
    packages.length) {
    return true;
  }

  console.log(chalk.red('Please create a subproject!'));
  return false;
}

module.exports = {
  isAllPage,
  isSinglePage,
  isSpa,
  isFilesExist,
  filesExistDoCopy,
  filesExistDoPush,
  filesExistDoConcatCopy,
  mergePackagesWebpackConfig,
  getPageConfig,
  validatePackages
}