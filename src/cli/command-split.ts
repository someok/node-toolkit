import path from 'path';
import _ from 'lodash';
import {CommanderStatic} from 'commander';
import {logError} from '@someok/node-utils/lib/logUtils';
import {existPath, fileName, PathMode} from '@someok/node-utils/lib/fileUtils';

import {SPLIT_OUTPUT_FOLDER} from '../context';
import {splitAllTxt2Dest, splitTxtFile2Dest} from '../split';
import {boolArg, logCustomHelp} from './utils';

/**
 * split 命令的自定义帮助信息
 */
export function customHelp() {
    logCustomHelp('s -t /path/to/txt/dir');
    logCustomHelp('split -t /path/to/txt/dir');
    logCustomHelp('split -t /path/to/txt/file.txt');
    logCustomHelp('split -t /path/to/txt/file.txt -d /path/to/dest/dir -o n');
}

interface Option {
    txt: string;
    dest?: string;
    overwrite?: boolean;
}

export function customCommand(program: CommanderStatic) {
    program
        .command('split')
        .alias('s')
        .description('按章节分隔单个 txt 文件到目标路径下')
        .option('-t, --txt <file/dir>', 'txt 文件路径，如为目录，则转换下面所有 txt 文件')
        .option('-d, --dest [dir]', '分割后文件输出的目标路径，默认为 txt 所在目录')
        .option('-o, --overwrite [Y/n]', '目标路径存在时是否覆盖', boolArg, true)
        .on('--help', function() {
            // txt2epub split -h 时显示此信息
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
                    options = {txt: opt.txt, dest: opt.dest, overwrite: opt.overwrite};
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

            const {txt, dest, overwrite} = options;

            let isFile = false;
            const txtMode = existPath(txt);
            if (txtMode === PathMode.NOT_EXIST) {
                logError(`[${txt}] 不存在`);
                return;
            }
            if (txtMode === PathMode.IS_FILE) {
                isFile = true;
            }

            let destFolder: string;
            if (!dest) {
                if (isFile) {
                    const name = fileName(txt);
                    destFolder = path.resolve(path.dirname(txt), SPLIT_OUTPUT_FOLDER, name);
                } else {
                    destFolder = path.resolve(txt, SPLIT_OUTPUT_FOLDER);
                }
            } else {
                // 检查是否为已存在文件而非文件夹
                const mode = existPath(dest);
                if (mode !== PathMode.IS_DIRECTORY) {
                    logError(`[${dest}] 是已存在文件，而非文件夹`);
                    return;
                }

                destFolder = dest;
            }

            if (isFile) {
                splitTxtFile2Dest(txt, destFolder, overwrite);
            } else {
                splitAllTxt2Dest(txt, destFolder, overwrite);
            }
        });
}
