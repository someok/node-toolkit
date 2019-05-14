const path = require('path');
const os = require('os');
const fs = require('fs');
const Mode = require('stat-mode');
const Iconv = require('iconv').Iconv;

const {logError} = require('./logUtils');

const gbk2utf8 = new Iconv('gbk', 'utf-8');
const big52utf8 = new Iconv('big5', 'utf-8');

const PathMode = {
    // 文件夹且可写
    IS_DIRECTORY: 201,

    // 文件且可写
    IS_FILE: 202,

    // 不存在
    NOT_EXIST: 404,
    // 存在但不可写
    NOT_WRITE: 405,
};
Object.freeze(PathMode);

exports.PathMode = PathMode;

/**
 * 判断给定路径属性，属性定义参见 {@link PathMode}。
 *
 * @param forPath 路径
 * @return {PathMode} 给定路径属性
 */
function existPath(forPath) {
    try {
        const stat = fs.statSync(forPath);
        const mode = new Mode(stat);

        if (!mode.owner.write) {
            return PathMode.NOT_WRITE;
        }

        if (stat.isDirectory()) {
            return PathMode.IS_DIRECTORY;
        }

        if (stat.isFile()) {
            return PathMode.IS_FILE;
        }
    } catch (e) {}
    return PathMode.NOT_EXIST;
}

exports.existPath = existPath;

/**
 * 判断给定路径是否为可写文件夹。
 *
 * @param forPath 路径
 * @return {boolean} 是否文件夹
 */
exports.existDir = function(forPath) {
    return PathMode.IS_DIRECTORY === existPath(forPath);
};

/**
 * 判断给定路径是否可写文件。
 *
 * @param forPath 路径
 * @return {boolean} 是否文件
 */
exports.existFile = function(forPath) {
    return PathMode.IS_FILE === existPath(forPath);
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

/**
 * 读取 gbk 或 utf8 格式文件，由于 node 默认不支持 gbk，所以使用 Iconv 来做转换。
 *
 * gbk 或 big5 格式检测是使用 Iconv 的转换异常来处理，判断顺序如下：
 *    1、先用 gbk 编码转换成 utf8，如果抛出异常
 *    2、接着用 big5 编码转换成 utf8，如果抛出异常
 *    3、最后则表示为 utf8
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
        covertedBuffer = gbk2utf8.convert(orignBuffer);
    } catch (e) {
        if (debug) {
            logError('gbk2utf8:');
            console.log(e);
        }

        try {
            covertedBuffer = big52utf8.convert(orignBuffer);
        } catch (e) {
            if (debug) {
                logError('big52utf8:');
                console.log(e);
            }

            covertedBuffer = orignBuffer;
        }
    }

    return covertedBuffer.toString();
};
