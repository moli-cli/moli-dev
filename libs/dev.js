var log = require("../utils/moliLogUtil");
var chalk = require("chalk");
var path = require("path");
var merge = require("webpack-merge");
var express = require("express");
var proxy = require('express-http-proxy');
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");

module.exports = {
    server: function (args) {
        // 初始化webpackConfig
        try {
            var moliConfig = require(path.resolve(".", "moli.config.js"));
            var devConfig = moliConfig.devConfig;
            var baseConfig = {
                entry: {},
                output: {},
                module: {
                    rules: []
                },
                plugins: []
            }
            var webpackConfig = merge(baseConfig, devConfig);
            log.info("the webpackConfig is ready!");
            var app = express();
            var router = express.Router();
            var compiler = webpack(webpackConfig);
            var mockConfig, svrConfig, proxyConfig, staticConfig;
            //读取服务器配置
            svrConfig = moliConfig.svrConfig;
            //读取代理配置
            proxyConfig = moliConfig.proxyConfig;
            //读取静态资源配置
            staticConfig = moliConfig.staticConfig;
            //设置mock配置
            mockConfig = require(path.resolve(".", "moli.mock.js"));
            //设置默认mock
            app.use(express.static(path.resolve('.', 'mock')));
            //设置指定静态资源目录
            app.use(express.static(path.resolve('.', staticConfig.folder)));
            //加载webpack处理
            app.use(webpackDevMiddleware(compiler, {
                publicPath: webpackConfig.output.publicPath,
                noInfo: svrConfig.noInfo,
                stats: {
                    colors: true
                }
            }));
            //判断是否启用proxy
            let isBreak = false;
            for (let i = 0; i < proxyConfig.length; i++) {
                if (proxyConfig[i].enable) {
                    isBreak = true;
                    break;
                }
            }
            if (isBreak) {
                console.log(chalk.yellow("\n/******************** Start loading proxy server ********************/\n"));
                proxyConfig.forEach(function (element) {
                    if (element.enable) {
                        app.use(element.router, proxy(element.url, element.options));
                        console.log(chalk.green(`[proxy] : ${element.router} to ${element.url}`));
                    }
                });
                console.log(chalk.yellow("\n/******************** Proxy server loaded completed *****************/\n"));
            } else {
                console.log(chalk.yellow("\n/******************** Start loading mock server ********************/\n"));
                for (let item in mockConfig) {
                    for (let i = 0; i < mockConfig[item].length; i++) {
                        for (let url in mockConfig[item][i]) {
                            console.log(chalk.green(`[mock]:[${url}] to ${mockConfig[item][i][url]}`));
                            router.all(url, function (req, res, next) {
                                console.log(chalk.green(`[mock]: ${req.method} ${req.ip} client router [${url}]-[${mockConfig[item][i][url]}]`));
                                res.sendFile(path.resolve(".", mockConfig[item][i][url]), {
                                    headers: {
                                        "moli-dev": require("../package.json").version
                                    }
                                });
                            });
                        }
                    }
                }
                console.log(chalk.yellow("\n/******************** Mock server loaded completed *****************/\n"));
                app.use(router);
            }
            app.use(require("webpack-hot-middleware")(compiler));
            app.listen(svrConfig.port, svrConfig.host, function () {
                console.log(chalk.yellow("\n/******************** Start dev server *****************/\n"));
                console.log(chalk.green(`[moli] : Listening on port http://${svrConfig.host}:${svrConfig.port}`));
                console.log(chalk.yellow("\n/******************** O(∩_∩)O *****************/\n"));
            });
        } catch (e) {
            log.error(e);
            log.error("Please check the configuration file");
            process.exit(0);
        } finally {
        }
    }
};