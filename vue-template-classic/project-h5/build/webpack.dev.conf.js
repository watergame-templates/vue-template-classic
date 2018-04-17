var fs = require('fs')
var utils = require('./utils')
var path = require('path')
var webpack = require('webpack')
var config = require('./config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
let original = JSON.parse(process.env.npm_config_argv)['original']
let vconsole = `
<script src=static/js/vconsole.min.js></script>
<script>
  window.vConsole = new VConsole();

  vConsole.setOption({
    'onReady': () =>{
      window.vConsole.hideSwitch()
    }
  })

</script>
`
let externals
if (original.includes('--app')) {
  externals = {}
} else {
  externals = {
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'leancloud-storage': 'AV',
    'better-scroll': 'BScroll',
    'lodash': '_'
  }
}

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})
module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  externals,
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      vueSrc: original.includes('--app') ? '' : 'https://cdn.bootcss.com/vue/2.5.9/vue.min.js',
      vuexSrc: original.includes('--app') ? '' : 'https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js',
      lodashSrc: original.includes('--app') ? '' : 'https://cdn.bootcss.com/lodash.js/4.17.4/lodash.min.js',
      vueRouterSrc: original.includes('--app') ? '' : 'https://cdn.bootcss.com/vue-router/3.0.1/vue-router.min.js',
      avSrc: original.includes('--app') ? '' : 'http://cdn1.lncld.net/static/js/3.6.0/av-min.js',
      vconsole: original.includes('--debug') ? vconsole : '',
      baiduak: 'AAYBZEfGmpQWniSllBMXIwxVnTcdcRS3',
      cordova: original.includes('--app') ? './static/js/cordova.js' : '',
      filename: 'index.html',
      template: 'index.ejs',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})
