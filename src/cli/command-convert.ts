import _ from 'lodash';
import {CommanderStatic} from 'commander';

import {logCustomHelp} from './utils';
import {logError} from '../utils/logUtils';
import {existPath, PathMode} from '../utils/fileUtils';

export function customHelp() {
    logCustomHelp('c /path/to/txt/dir');
    logCustomHelp('convert /path/to/txt/dir');
    logCustomHelp('c -b /path/to/txt/dir');
    logCustomHelp('convert -b /path/to/txt/dir');
}

interface Option {
    txt: string;
    dest?: string;
    batch?: boolean;
}

export function customCommand(program: CommanderStatic) {
    // noinspection HtmlDeprecatedTag
    program
        .command('convert')
        .alias('c')
        .description('转换 txt 所在目录为 epub 格式')
        .option('-t, --txt <dir>', 'txt 文件路径，如为目录，则转换下面所有 txt 文件')
        .option('-d, --dest [dir]', '分割后文件输出的目标路径，默认为 txt 所在目录')
        .option('-b, --batch', '批量转换给定目录下所有文件夹成为 epub')
        .on('--help', function() {
            console.log('');
            console.log('Examples:');
            console.log('');
            customHelp();
        })
        .action(function(...actionArgs: string[]) {
            // 将参数转换为数组，并提取最后一个作为 options（其实就是 Command 对象）
            const args = actionArgs.length === 1 ? [actionArgs[0]] : Array.apply(null, actionArgs);

            let options: Option | undefined;
            if (_.isArray(args) && !_.isEmpty(args)) {
                const opt = args[args.length - 1] as Option;

                if (opt.txt) {
                    options = {txt: opt.txt, dest: opt.dest, batch: opt.batch};
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

            const {txt, dest, batch} = options;

            const mode = existPath(txt);
            if (mode === PathMode.NOT_EXIST) {
                logError(`[${txt}] 不存在`);
                return;
            }
            if (mode !== PathMode.IS_DIRECTORY) {
                logError(`[${txt}] 不是文件夹`);
                return;
            }

            // 读取 metadata 信息（如果存在）
        });
}
