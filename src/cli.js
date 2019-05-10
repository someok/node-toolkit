#!/usr/bin/env node

const program = require('commander');
const path = require('path');

const pkg = require('../package');
const {SPLIT_OUTPUT_FOLDER, CLI_NAME} = require('./context');
const metadataInit = require('./metadata/init');
const {logError} = require('./utils/logUtils');
const {existFolder, FolderMode, fileName} = require('./utils/fileUtils');
const {splitTxtFile2Dest, splitAllTxt2Dest} = require('./split/splitFile');

function customInitHelp() {
    console.log(`  $ ${CLI_NAME} init`);
    console.log(`  $ ${CLI_NAME} init /path/to/txt/dir`);
}

function customSplitHelp() {
    console.log(`  $ ${CLI_NAME} split -t /path/to/txt/dir`);
    console.log(`  $ ${CLI_NAME} split -t /path/to/txt/file.txt`);
    console.log(`  $ ${CLI_NAME} split -t /path/to/txt/file.txt -d /path/to/dest/dir -o n`);
}

program
    .version(pkg.version, '-v, --version')
    .name(CLI_NAME)
    .description('转换指定文件夹下的 txt 为 epub 格式');

program
    .command('init [dir]')
    .description('交互式命令，初始化 yaml 格式的 metadata 文件, [dir] 未提供时采用当前目录')
    .action(function(dir) {
        metadataInit(dir || process.cwd());
    })
    .on('--help', function() {
        console.log('');
        console.log('Examples:');
        console.log('');
        customInitHelp();
    });

function boolArg(arg) {
    return 'yes' === arg.toLowerCase() || 'y' === arg.toLowerCase();
}

program
    .command('split')
    .description('按章节分隔单个 txt 文件到目标路径下')
    .option('-t, --txt <file/dir>', 'txt 文件路径，如为目录，则转换下面所有 txt 文件')
    .option('-d, --dest [dir]', '分割后文件输出的目标路径，默认为 txt 所在目录')
    .option('-o, --overwrite [Y/n]', '目标路径存在时是否覆盖', boolArg, true)
    .on('--help', function() {
        console.log('');
        console.log('Examples:');
        console.log('');
        customSplitHelp();
    })
    .action(function(options) {
        const {txt, dest, overwrite} = options;

        // 未提供 txt 参数时输出错误信息和当前命令的帮助信息
        if (!txt) {
            console.log();
            logError('[-t, --txt] 参数不能为空');
            console.log();
            this.outputHelp();
            return;
        }

        let isFile = false;
        const txtMode = existFolder(txt);
        if (txtMode === FolderMode.NOT_EXIST) {
            logError(`[${txt}] 不存在`);
            return;
        }
        if (txtMode === FolderMode.NOT_FOLDER) {
            isFile = true;
        }

        let destFolder = dest;
        if (!dest) {
            if (isFile) {
                const name = fileName(txt);
                destFolder = path.resolve(path.dirname(txt), SPLIT_OUTPUT_FOLDER, name);
            } else {
                destFolder = path.resolve(txt, SPLIT_OUTPUT_FOLDER);
            }
        } else {
            // 检查是否为已存在文件而非文件夹
            const mode = existFolder(dest);
            if (mode === FolderMode.NOT_FOLDER) {
                logError(`[${dest}] 是已存在文件，而非文件夹`);
                return;
            }
        }

        if (isFile) {
            splitTxtFile2Dest(txt, destFolder, overwrite);
        } else {
            splitAllTxt2Dest(txt, destFolder, overwrite);
        }
    });

// program.command('help [cmd]').description('display help for [cmd]');

program.on('--help', function() {
    console.log('');
    console.log('Examples:');

    customInitHelp();
    console.log();
    customSplitHelp();
});

// error on unknown commands
program.on('command:*', function() {
    console.error(
        'Invalid command: %s\nSee --help for a list of available commands.',
        program.args.join(' ')
    );
    process.exit(1);
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}
