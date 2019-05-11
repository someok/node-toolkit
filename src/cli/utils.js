const {CLI_NAME} = require('./ctx');

exports.logCustomHelp = function logCustomHelp(help) {
    console.log(`  $ ${CLI_NAME} ${help}`);
};

/**
 * bool 型参数规则，需要为「yes」或「y」，忽略大小写。
 *
 * @param arg 参数内容
 * @return {boolean} 是或否
 */
exports.boolArg = function boolArg(arg) {
    return 'yes' === arg.toLowerCase() || 'y' === arg.toLowerCase();
};
