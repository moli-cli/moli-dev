/*
 * @Author: gct
 * @Date:   2017-5-15 00:00:00
 * @Last Modified by:   gct
 * @Last Modified time: 2017-11-20 08:52:25
 */

var log = require("../utils/moliLogUtil");

/**
 * 帮助信息
 */
function getHelp() {
    console.log(chalk.green(" Usage : "));
    console.log();
    console.log(chalk.green(" moli dev"));
    console.log();
    process.exit(0);
}

/**
 * 版本信息
 */
function getVersion() {
    log.log("version:" + require("../package.json").version, "#00bb00");
    process.exit(0);
}

module.exports = {
    plugin: function (options) {
        var args = {};
        args.commands = options.cmd;
        args.pluginname = options.name;
        if (options.argv.h || options.argv.help) {
            getHelp();
        }
        if (options.argv.v || options.argv.version) {
            getVersion();
        }
        if (options.argv.w || options.argv.web) {
            process.env.NODE_MOLIENV = "pc";
        }
        if (options.argv.m || options.argv.mobile) {
            process.env.NODE_MOLIENV = "mobile";
        }
        console.log("env:" + process.env.NODE_MOLIENV);
        var dev = require("../libs/dev");
        dev.server(args);
    }
};
