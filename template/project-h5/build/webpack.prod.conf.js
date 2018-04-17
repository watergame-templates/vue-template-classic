var path = require('path')
var fs = require('fs')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('./config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
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
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'leancloud-storage': 'AV',
    'better-scroll': 'BScroll',
    'lodash': '_'
  }
}

var env = process.env.NODE_ENV === 'testing'
  ? require('./config/test.env')
  : config.build.env
var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  externals,
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    publicPath: './',
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: original.includes('--debug') ? false : true,
        drop_console:  original.includes('--debug') ? false : true
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      vueSrc: original.includes('--app') ? '' : 'https://cdn.bootcss.com/vue/2.5.9/vue.min.js',
      vuexSrc: original.includes('--app') ? '' : 'https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js',
      lodashSrc: original.includes('--app') ? '' : 'https://cdn.bootcss.com/lodash.js/4.17.4/lodash.min.js',
      vueRouterSrc: original.includes('--app') ? '' : 'https://cdn.bootcss.com/vue-router/3.0.1/vue-router.min.js',
      avSrc: original.includes('--app') ? '' : 'http://cdn1.lncld.net/static/js/3.6.0/av-min.js',
      vconsole: original.includes('--debug') ? vconsole : '',
      baiduak: 'AAYBZEfGmpQWniSllBMXIwxVnTcdcRS3',
      cordova: original.includes('--app') ? '../cordova.js' : '',
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,
      template: 'index.ejs',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vender modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
