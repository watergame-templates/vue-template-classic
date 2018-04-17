var path = require('path')
var fs = require('fs')
var utils = require('./utils')
var config = require('./config')
var vueLoaderConfig = require('./vue-loader.conf')
var vuxLoader = require('vux-loader')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
let original = JSON.parse(process.env.npm_config_argv)['original']

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
let entry
if (original.includes('--app')) {
  entry = ["babel-polyfill", "./src/main.js"]
} else {
  entry = {
    app: './src/main.js'
  }
}

var webpackConfig = {
  entry,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.ts', '.tsx', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'views': resolve('src/views'), // 视图界面，路由组件用
      'form': resolve('src/shared/form'), // 公共视图界面，路由组件用
      'components': resolve('src/components'), // 组件
      'ctrl': resolve('src/shared/ctrl'), // 公用组件
      'utils': resolve('src/shared/utils'), // 公用方法
      'core': resolve('src/shared/core'),
      'constants': resolve('src/shared/constants'), // 常量
      'assets': resolve('src/assets'), // 资源文件，img,fonts,stylus
      'static': resolve('static') // 静态文件夹
    },
    symlinks: false
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/vue-echarts-v3/src')],
        options: {
          'plugins': ['lodash']
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}

module.exports = vuxLoader.merge(webpackConfig, {
  
  plugins: [
    new LodashModuleReplacementPlugin,
    'vux-ui',
    'duplicate-style',
    {
      name: 'less-theme',
      path: 'src/assets/stylus/theme.ex.less'
    }
  ]
})
