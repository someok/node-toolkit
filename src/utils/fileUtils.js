const path = require('path');
const os = require('os');
const fs = require('fs');
const Mode = require('stat-mode');
const klawSync = require('klaw-sync');
const _ = require('lodash');
const pingyin = require('pinyinlite');
// const detectCharacterEncoding = require('detect-character-encoding');
// const jschardet = require('jschardet');
// const fsi = require('fs-iconv');
// const iconv = require('iconv-jschardet');
// const chardet = require('chardet');
const Iconv = require('iconv').Iconv;

const iconv = new Iconv('GBK', 'UTF-8');

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
 * 返回给定文件名，不包含扩展名。
 *
 * @param file 文件
 * @param includeExt 是否包含扩展名，默认不包含
 * @return {string} 文件名
 */
exports.fileName = function(file, includeExt = false) {
    let name = path.basename(file);

    if (!includeExt) {
        const ext = path.extname(file);
        name = name.replace(ext, '');
    }
    return name;
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

/**
 * 读取 gbk 或 utf8 格式文件，由于 node 默认不支持 gbk，所以使用 Iconv 来做转换。
 *
 * 规则是默认先用 gbk 编码转换成 utf8，如果抛出异常，则默认为是 utf8 编码。
 *
 * 这种搞法其实很不科学，可惜 node 里面判断编码的方式很讨厌，用了多个检测包都不好使。
 *
 * @param file 文件路径
 * @param debug true 的时候会输出异常信息
 * @return {string} 文件内容，utf8 格式
 */
exports.readUtf8OrGbkReadFile = function(file, debug = false) {
    const orignBuffer = fs.readFileSync(file);

    let covertedBuffer;
    try {
        covertedBuffer = iconv.convert(orignBuffer);
    } catch (e) {
        if (debug) {
            console.log(e);
        }
        covertedBuffer = orignBuffer;
    }

    return covertedBuffer.toString();
};
