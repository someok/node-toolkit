const path = require('path');
const os = require('os');
const fs = require('fs');
const Mode = require('stat-mode');

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
