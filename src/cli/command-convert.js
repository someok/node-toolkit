const {logCustomHelp, boolArg} = require('./utils');

function customHelp() {
    logCustomHelp('c /path/to/txt/dir');
    logCustomHelp('convert /path/to/txt/dir');
    logCustomHelp('c -b /path/to/txt/dir');
    logCustomHelp('convert -b /path/to/txt/dir');
}

function customCommand(program) {
    program
        .command('convert')
        .alias('c')
        .description('转换 txt 所在目录为 epub 格式')
        .option('-b, --batch', '批量转换给定目录下所有文件夹成为 epub')
        .on('--help', function() {
            console.log('');
            console.log('Examples:');
            console.log('');
            customHelp();
        })
        .action(function(dir, cmd) {
            console.log('-----------');
            console.log(dir, cmd.batch);
            console.log('-----------');
        });
}

module.exports = {
    customHelp,
    customCommand,
};
