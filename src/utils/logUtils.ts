import chalk, {Chalk} from 'chalk';

const PREFIX = '>> ';

function commonLog(msg: string, type: 'cyan' | 'yellowBright' | 'red', options?: object) {
    const opts = {prefix: PREFIX, bold: false, ...options};
    const ck: Chalk = opts.bold ? chalk.bold : chalk;
    console.log(ck[type](`${opts.prefix}${msg}`));
}

export function log(msg: string, options?: object) {
    commonLog(msg, 'cyan', options);
}

export function logWarn(msg: string, options?: object) {
    commonLog(msg, 'yellowBright', options);
}

export function logError(msg?: string, options?: object) {
    msg && commonLog(msg, 'red', options);
}
