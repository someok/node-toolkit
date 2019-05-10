const path = require('path');
const os = require('os');
const fs = require('fs');
const Mode = require('stat-mode');
const klawSync = require('klaw-sync');
const _ = require('lodash');
const pingyin = require('pinyinlite');

const FolderMode = {
    // 文件夹存在且可写
    NORMAL: 200,
    // 文件夹不存在
    NOT_EXIST: 404,
    // 文件夹存在但不可写
    NOT_WRITE: 405,
    // 不是有效文件夹
    NOT_FOLDER: 406,
};
Object.freeze(FolderMode);

exports.FolderMode = FolderMode;

/**
 * 判断给定文件夹是否存在。
 *
 * @param folder 文件夹路径
 * @return {number} FileMode 中定义的数字
 */
exports.existFolder = function existFolder(folder) {
    try {
        const stat = fs.statSync(folder);
        const mode = new Mode(stat);

        if (!stat.isDirectory()) {
            return FolderMode.NOT_FOLDER;
        }

        if (!mode.owner.write) {
            return FolderMode.NOT_WRITE;
        }

        return FolderMode.NORMAL;
    } catch (e) {
        return FolderMode.NOT_EXIST;
    }
};

/**
 * 创建 temp 文件夹。
 *
 * @param prefix
 * @return {string}
 */
exports.createTempFolder = function createTempFolder(prefix = 't2e-') {
    return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
};

function txtFilter(item) {
    const basename = path.basename(item.path);
    return basename.toLowerCase().endsWith('.txt');
}

/**
 * 返回给定文件夹下所有 txt 文本文件名，并按照拼音排序。
 *
 * 如果文件名是 01_file_real_name.txt 格式，则会返回 file_real_name，前置的 01 用于排序。
 *
 * @param folder txt 文件夹
 * @return {Array} txt 文件名构成的数组
 */
exports.loadAllTxtFileNames = function(folder) {
    const files = klawSync(folder, {
        nodir: true,
        filter: txtFilter,
    });

    if (_.isEmpty(files)) {
        return null;
    }

    const fileArr = files.map(file => {
        const title = path.basename(file.path, '.txt').trim();
        return {
            title,
            pinyin: pingyin(title).join(' '),
        };
    });
    fileArr.sort((f1, f2) => {
        return f1.pinyin.localeCompare(f2.pinyin);
    });
    return fileArr.map(file => {
        const re = /^\d*_+(.+)/g;
        const title = file.title;
        const match = re.exec(title);
        if (match) {
            return match[1];
        }
        return title;
    });
};
