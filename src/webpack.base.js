function $molilog(msg){
  if(chalk){
    console.log(chalk.hex('#FF7E00')('[moli] >>>>>>>>>> ' + msg));
  }else{
    console.log('[moli] >>>>>>>>>> ' + msg);
  }
}

var path = require("path");
var chalk = require("chalk");
var merge = require("webpack-merge");

var moliConfig;


$molilog("webpack.base is running......");
try {
  moliConfig = require(path.resolve(".","moli.config.js")).devConfig;
} catch (e) {
  console.log(chalk.red(e));
  console.log("[moli] Please check the configuration file");
  process.exit(0);
} finally {

}


var baseConfig= {
  entry: {

  },
  output: {

  },
  module: {
    rules: []
  },
  plugins: []
}


module.exports = merge(baseConfig, moliConfig);
