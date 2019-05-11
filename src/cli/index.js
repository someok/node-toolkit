#!/usr/bin/env node

const program = require('commander');

const pkg = require('../../package');
const {CLI_NAME} = require('./ctx');
const initCommand = require('./command-init');
const splitCommand = require('./command-split');
const convertCommand = require('./command-convert');

program
    .version(pkg.version, '-v, --version')
    .name(CLI_NAME)
    .description('转换指定文件夹下的 txt 为 epub 格式');

// init 命令定义
initCommand.customCommand(program);

// split 命令定义
splitCommand.customCommand(program);

// convert 命令定义
convertCommand.customCommand(program);

// txt2epub -h 时候输出扩展帮助信息
// 在明确的命令下的帮助有所不同
// 例如 txt2epub split -h 时候不触发此事件，而是触发对应命令自己的事件
program.on('--help', function() {
    console.log('');
    console.log('Examples:');

    initCommand.customHelp();
    console.log();
    splitCommand.customHelp();
    console.log();
    convertCommand.customHelp();
});

// 命令错误时输出此提示
program.on('command:*', function() {
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
