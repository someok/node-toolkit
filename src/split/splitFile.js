const klawSync = require('klaw-sync');
const path = require('path');
const _ = require('lodash');

const {readUtf8OrGbkReadFile, fileName} = require('../utils/fileUtils');
const {log, logError, logWarn} = require('../utils/logUtils');
const {splitAuto} = require('./splitTxt');
const {outputChapters} = require('./outputTxt');

/**
 * 分割单个 txt 文件到目标文件夹。
 *
 * @param txtFile txt 文件路径
 * @param destFolder 目标文件夹
 * @param overwrite 如果目标文件夹已经存在是否覆盖，默认覆盖
 */
function splitTxtFile2Dest(txtFile, destFolder, overwrite = true) {
    try {
        const txt = readUtf8OrGbkReadFile(txtFile);
        const chapters = splitAuto(txt);
        const {success, message} = outputChapters(chapters, destFolder, overwrite);

        if (success) {
            log(`文本分隔完毕，目标文件位于 [${destFolder}]`);
        } else {
            logError(message);
        }
    } catch (e) {
        logError(`文本分隔过程中出现错误：[${txtFile}]，Err: ${e.message}`);
    }
}

/**
 * 批量转换给定 txt 文件下的所有 txt 文件。
 *
 * @param txtFolder txt 文件夹
 * @param destFolder 目标文件夹
 * @param overwrite 是否覆盖已存在文件夹
 */
function splitAllTxt2Dest(txtFolder, destFolder, overwrite = true) {
    function txtFilter(item) {
        const ext = path.extname(item.path);
        return ext === '.txt';
    }

    const files = klawSync(txtFolder, {nodir: true, filter: txtFilter});
    if (_.isEmpty(files)) {
        logWarn(`[${txtFolder}] 中没有 txt 文件`);
        return;
    }

    files.forEach(file => {
        const name = fileName(file.path);
        const dest = path.resolve(destFolder, name);
        splitTxtFile2Dest(file.path, dest, overwrite);
    });
}

module.exports = {
    splitTxtFile2Dest,
    splitAllTxt2Dest,
};
