import _ from 'lodash';
import {CommanderStatic} from 'commander';
import {logError, logInfo} from '@someok/node-utils/lib/logUtils';
import {existPath, PathMode} from '@someok/node-utils/lib/fileUtils';

import {boolArg, logCustomHelp} from './utils';
import {regenerateAllCover, regenerateCover} from '../metadata/cover';

export function customHelp(): void {
    logCustomHelp('cover /path/to/txt/dir');
    logCustomHelp('cover -b /path/to/txt/dir');
}

interface Option {
    txt: string;
    batch?: boolean;
    overwrite: boolean;
}

export function customCommand(program: CommanderStatic): void {
    // noinspection HtmlDeprecatedTag
    program
        .command('cover')
        .description('生成 txt 所在目录的封面图片')
        .option('-t, --txt <dir>', 'txt 目录')
        .option('-b, --batch', '批量生成给定目录下所有文件夹成的封面图片')
        .option('-o, --overwrite [Y/n]', '封面图片存在时是否覆盖', boolArg, true)
        .on('--help', function (): void {
            console.log('');
            console.log('Examples:');
            console.log('');
            customHelp();
        })
        .action(function (...args: Option[]): void {
            // 将参数转换为数组，并提取最后一个作为 options（其实就是 Command 对象）
            // const args = actionArgs.length === 1 ? [actionArgs[0]] : Array.apply(null, actionArgs);

            let options: Option | undefined;
            if (_.isArray(args) && !_.isEmpty(args)) {
                const opt = args[args.length - 1];

                if (opt.txt) {
                    options = {txt: opt.txt, batch: opt.batch, overwrite: opt.overwrite};
                }
            }

            // 未提供 txt 参数时输出错误信息和当前命令的帮助信息
            if (!options) {
                console.log();
                logError('[-t, --txt] 参数不能为空');
                console.log();
                program.outputHelp();
                return;
            }

            const {txt, batch, overwrite} = options;
            if (existPath(txt) !== PathMode.IS_DIRECTORY) {
                logError(`[${txt}] 不是合法目录`);
                return;
            }

            if (batch) {
                regenerateAllCover(txt, overwrite)
                    .then((): void => {
                        console.log();
                        logInfo('Done!');
                    })
                    .catch((err): void => {
                        logError(err.message);
                    });
            } else {
                regenerateCover(txt, overwrite)
                    .then((): void => {
                        console.log();
                        logInfo('Done!');
                    })
                    .catch((err): void => {
                        logError(err.message);
                    });
            }
        });
}
