/*
 * @Author: gct
 * @Date:   2017-5-15 00:00:00
 * @Last Modified by:   gct
 * @Last Modified time: 2017-11-20 08:52:25
 */

var log = require("../utils/moliLogUtil");
const PACKAGE_TYPE_PC = "pc";
const PACKAGE_TYPE_MOBILE = "mobile";

/**
 * 帮助信息
 */
function getHelp() {
    log.log("  Usage : ");
    log.log("");
    log.log("  moli dev [options]");
    log.log("");
    log.log("  options:");
    log.log("");
    log.log("    -m, --mobile       run dev in mobile mode");
    log.log("    -w, --web          run dev in web mode（default mode）");
    log.log("    -h, --help         moli-dev help info");
    log.log("    -v, --version      moli-dev version info");
    log.log("");
    log.log("  Examples:");
    log.log("");
    log.log("    $ moli dev -w");
    log.log("    $ moli dev --mobile");
    log.log("");
    process.exit(0);
}

/**
 * 版本信息
 */
function getVersion() {
    log.success("version:" + require("../package.json").version);
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
        if (options.argv.m || options.argv.mobile) {
            process.env.NODE_MOLIENV = PACKAGE_TYPE_MOBILE;
        }
        if (options.argv.w || options.argv.web) {
            process.env.NODE_MOLIENV = PACKAGE_TYPE_PC;
        }
        // 若用户未传递以上两种信息，默认设置为pc（web）模式
        if (!process.env.NODE_MOLIENV) {
            process.env.NODE_MOLIENV = PACKAGE_TYPE_PC;
        }
        log.info("dev env:" + process.env.NODE_MOLIENV);
        var dev = require("../libs/dev");
        dev.server(args);
    }
};
