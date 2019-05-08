#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package');
const metadataInit = require('./metadata/init');

const PKG_NAME = pkg.name;

program
    .version(pkg.version)
    .name(PKG_NAME)
    .option('-d, --debug', 'output extra debugging')
    .option('-s, --small', 'small pizza size')
    .option('-p, --pizza-type <type>', 'flavour of pizza');

program
    .command('init [dir]')
    .description('初始化 yaml 格式的 metadata 文件, [dir] 未提供时采用当前目录')
    .action(function(dir) {
        metadataInit(dir || process.cwd());
    });

// program.command('help [cmd]').description('display help for [cmd]');

program.on('--help', function() {
    console.log('');
    console.log('Examples:');
    console.log(`  $ ${PKG_NAME} --help`);
    console.log(`  $ ${PKG_NAME} -h`);
    console.log(`  $ ${PKG_NAME} init /path/to/txt/dir`);
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

if (program.debug) console.log(program.opts());
if (program.small) console.log('- small pizza size');
if (program.pizzaType) console.log(`- ${program.pizzaType}`);
