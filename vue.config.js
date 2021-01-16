/*
 * @Author: abc
 * @Date: 2020-11-03 11:58:51
 * @LastEditors: abc
 * @LastEditTime: 2020-12-29 18:12:31
 * @Description: vue config  file
 */
const path = require('path');
const { IgnorePlugin } = require('webpack');
// const variable = require('./src/assets/js/variable');
function resolve(dir) {
  // path.join(
  return path.join(__dirname, dir);
}
let pattern = false;
if (process.env.NODE_ENV !== 'production') {
  pattern = true;
} else {
  // plugins.push('transform-remove-console');
  pattern = false;
}
module.exports = {
  pwa: {
    iconPaths: {
      favicon32: 'favicon.ico',
      favicon16: 'favicon.ico',
      appleTouchIcon: 'favicon.ico',
      maskIcon: 'favicon.ico',
      msTileImage: 'favicon.ico'
    }
  },
  runtimeCompiler: true,
  /*  devServer: {
    // can be overwritten by process.env.HOST
    host: '127.0.0.1',
    port: 8083
  }, */
  productionSourceMap: pattern,
  css: {
    sourceMap: pattern,
    extract: !pattern,
    loaderOptions: {
      less: {
        lessOptions: {
          // modifyVars: variable,
          javascriptEnabled: true
        }
      }
    }
  },
  configureWebpack: {
    performance: {
      hints: 'warning',
      maxEntrypointSize: 50000000,
      maxAssetSize: 30000000,
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js');
      }
    },
    plugins: [new IgnorePlugin(/^\.\/locale$/, /moment$/)],
    resolve: {
      alias: {
        '@ant-design/icons/lib/dist$': resolve('./src/plugins/icons.js')
      }
    }
  },
  chainWebpack: config => {
    const imagesRule = config.module.rule('images');
    imagesRule
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      })
      .end();
  }
};
