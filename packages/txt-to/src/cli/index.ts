#!/usr/bin/env node

import program from 'commander';

import {VERSION} from '../context';

import {CLI_NAME} from './ctx';

program
    .version(VERSION, '-v, --version')
    .name(CLI_NAME)
    .description('转换指定文件夹下的 txt 为 epub 格式');

const commands = [
    require('./command-init'),
    require('./command-split'),
    require('./command-convert'),
    require('./command-cover'),
];

commands.forEach((cmd): void => {
    cmd.customCommand && cmd.customCommand(program);
});

// txt2epub -h 时候输出扩展帮助信息
// 在明确的命令下的帮助有所不同
// 例如 txt2epub split -h 时候不触发此事件，而是触发对应命令自己的事件
program.on('--help', function (): void {
    console.log('');
    console.log('Examples:');

    commands.forEach((cmd, index): void => {
        if (cmd.customHelp) {
            cmd.customHelp();

            if (index < commands.length - 1) console.log();
        }
    });
});

// 命令错误时输出此提示
program.on('command:*', function (): void {
    console.error(
        'Invalid command: %s\nSee --help for a list of available commands.',
        program.args.join(' ')
    );
    process.exit(1);
});

program.parse(process.argv);

// 未提供任何命令时输出帮助信息
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
