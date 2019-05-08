const chalk = require('chalk');

const PREFIX = '>> ';

function commonLog(msg, type, options = {}) {
    const opts = {prefix: PREFIX, bold: false, ...options};
    const ck = opts.bold ? chalk.bold : chalk;
    console.log(ck[type](`${opts.prefix}${msg}`));
}

exports.log = function(msg, options) {
    commonLog(msg, 'cyan', options);
};

exports.logWarn = function(msg, options) {
    commonLog(msg, 'yellowBright', options);
};

exports.logError = function(msg, options) {
    commonLog(msg, 'red', options);
};
