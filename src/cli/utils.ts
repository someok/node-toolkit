import {CLI_NAME} from './ctx';

export function logCustomHelp(help: string) {
    console.log(`  $ ${CLI_NAME} ${help}`);
}

/**
 * bool 型参数规则，需要为「yes」或「y」，忽略大小写。
 *
 * @param arg 参数内容
 * @return {boolean} 是或否
 */
export function boolArg(arg: string) {
    return 'yes' === arg.toLowerCase() || 'y' === arg.toLowerCase();
}
