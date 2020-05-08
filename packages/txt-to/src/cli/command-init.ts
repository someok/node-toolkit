import {CommanderStatic} from 'commander';

import {logCustomHelp} from './utils';
import metadataInit from '../metadata';

/**
 * init 命令的自定义帮助信息
 */
export function customHelp(): void {
    logCustomHelp('i');
    logCustomHelp('index.ts');
    logCustomHelp('init /path/to/txt/dir');
}

export function customCommand(program: CommanderStatic): void {
    program
        .command('init [dir]')
        .alias('i')
        .description('交互式命令，初始化 yaml 格式的 metadata 文件, [dir] 未提供时采用当前目录')
        .on('--help', function (): void {
            // txt2epub init -h 时显示此信息
            console.log('');
            console.log('Examples:');
            console.log('');
            customHelp();
        })
        .action(function (dir): void {
            metadataInit(dir || process.cwd());
        });
}
