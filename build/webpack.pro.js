if (process.env.npm_lifecycle_event == "build:watch") {
    config = merge(config, {
      devtool: "cheap-source-map"
    });
  }
  // 图形化分析打包文件大小
  if (process.env.npm_lifecycle_event === "build:report") {
    const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
      .BundleAnalyzerPlugin;
    config.plugins.push(new BundleAnalyzerPlugin());
  }