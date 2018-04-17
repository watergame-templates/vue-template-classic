async function execute(cwd, isstg = true) {
    require('./check-versions')()
    if (!isstg) process.env.NODE_ENV = 'production'
    else process.env.NODE_ENV = 'stage'
    var ora = require('ora')
    var rm = require('rimraf')
    var path = require('path')
    var chalk = require('chalk')
    var webpack = require('webpack')
    var config = require('./config')
    var webpackConfig = require('./webpack.prod.conf')
    const fs = require('fs')
    const env = require('process').env
    var exec = require('child_process').exec;
    let build_type = config.dev.env.build_type

    let original = JSON.parse(process.env.npm_config_argv)['original']

    var spinner = ora('building for production...')
    spinner.start()

    let configPath = path.resolve(cwd, '../src/shared/utils/config.g.json')
    let configJson = JSON.parse(fs.readFileSync(configPath))

    let appPath = path.resolve(cwd, '../dist/app')
    let wxPath = path.resolve(cwd, '../dist/wx')
    let mixappPath = path.resolve(cwd, '../dist/mixapp')
    if (build_type === 'mixapp') {
        if (env.OS === 'Windows_NT') {
            // windows系统
            let rdIOS = 'rd /S /Q ' + mixappPath + '\\static'
            let delIOS = 'del /Q ' + mixappPath + '\\index.html'
            exec(rdIOS, e => e)
            exec(delIOS, e => e)
        } else {
            // MAC 系统
            let rdIOS = 'rm -rf ' + mixappPath + '/static'
            let delIOS = 'rm -f ' + mixappPath + '/index.html'
            exec(rdIOS, e => e)
            exec(delIOS, e => e)
        }
        fs.writeFileSync(configPath, JSON.stringify(configJson))
    } else if (build_type ===  '--app') {
        // configJson.project_build_type = "app"
        if (env.OS === 'Windows_NT') {
            // windows系统
            let rdIOS = 'rd /S /Q ' + appPath + '\\static'
            let delIOS = 'del /Q ' + appPath + '\\index.html'
            exec(rdIOS, e => e)
            exec(delIOS, e => e)
        } else {
            // MAC 系统
            let rdIOS = 'rm -rf ' + appPath + '/static'
            let delIOS = 'rm -f ' + appPath + '/index.html'
            exec(rdIOS, e => e)
            exec(delIOS, e => e)
        }
        fs.writeFileSync(configPath, JSON.stringify(configJson))
    } else {
        if (env.OS === 'Windows_NT') {
            // windows系统
            let rdIOS = 'rd /S /Q ' + wxPath + '\\static'
            let delIOS = 'del /Q ' + wxPath + '\\index.html'
            exec(rdIOS, e => e)
            exec(delIOS, e => e)
        } else {
            // MAC 系统
            let rdIOS = 'rm -rf ' + wxPath + '/static'
            let delIOS = 'rm -f ' + wxPath + '/index.html'
            exec(rdIOS, e => e)
            exec(delIOS, e => e)
        }
    }

    rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
        if (err) throw err
        webpack(webpackConfig, function (err, stats) {
            spinner.stop()
            if (err) throw err
            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n\n')

            if (stats.hasErrors()) {
                console.log(chalk.red('  Build failed with errors.\n'))
                process.exit(1)
            }

            console.log(chalk.cyan('  Build complete.\n'))
            console.log(chalk.yellow(
                '  Tip: built files are meant to be served over an HTTP server.\n' +
                '  Opening index.html over file:// won\'t work.\n'
            ))
            process.exit(0);
        })
    })
}

execute(__dirname);

module.exports = { execute };