import chalk from 'chalk';
import logSymbols from 'log-symbols';

export function logInfo(msg?: string): void {
    msg && console.log(logSymbols.info, chalk.blueBright(msg));
}

export function logSuccess(msg?: string): void {
    msg && console.log(logSymbols.success, chalk.greenBright(msg));
}

export function logWarning(msg?: string): void {
    msg && console.log(logSymbols.warning, chalk.yellowBright(msg));
}

export function logError(msg?: string): void {
    msg && console.log(logSymbols.error, chalk.redBright(msg));
}
