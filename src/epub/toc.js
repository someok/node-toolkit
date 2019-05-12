const path = require('path');
const fs = require('fs');
const klawSync = require('klaw-sync');
const _ = require('lodash');
const pingyin = require('pinyinlite');

const mdListParser = require('../utils/marked/list2JsonParser');
const {logError} = require('../utils/logUtils');
const TxtNode = require('../utils/TxtNode');
const {TOC_FILE, METADATA_FOLDER} = require('../context');

function loadToc(folder) {
    const tocPath = path.resolve(folder, METADATA_FOLDER, TOC_FILE);
    if (fs.existsSync(tocPath)) {
        const mdContent = fs.readFileSync(tocPath);
        const mdTocNodes = mdListParser(mdContent.toString());

        return mdTocNodes;
    }

    // 不存在 toc.md 文件，则直接读取 txt 文件名作为目录
    return loadAllTxtFileNames(folder, true);
}

/**
 * 文件过滤，支持 txt 扩展名。
 *
 * todo: 将来可以考虑增加 md 扩展名。
 *
 * @param item 文件路径
 * @return {boolean} 是否有效文本文件
 */
function txtFilter(item) {
    return ['.txt'].includes(path.extname(item.path).toLowerCase());
}

/**
 * 返回给定文件夹下所有 txt 文本文件名，并按照拼音排序。
 *
 * 如果文件名是 01_file_real_name.txt 格式，则会返回 file_real_name，前置的 01 用于排序。
 *
 * @param folder txt 文件夹
 * @param pinyinSort 是否按照拼音排序
 * @return {Array} txt 文件名构成的数组，每个条目包括：{rawTitle, title, ext, pinyin}
 */
function loadAllTxtFileNames(folder, pinyinSort = false) {
    const files = klawSync(folder, {
        nodir: true,
        filter: txtFilter,
    });

    if (_.isEmpty(files)) {
        return null;
    }

    const fileArr = files.map(file => {
        // 如果标题前面有数字（格式为：123__xxx），则去掉下划线及前置数字，只保留后面内容
        const re = /^(\d*_{2})?(.+)/g;

        const filePath = file.path;
        const ext = path.extname(filePath);
        const rawTitle = path.basename(filePath, ext).trim();
        const match = re.exec(rawTitle);
        let title = rawTitle;
        if (match) {
            title = match[2];
        }

        return {
            rawTitle,
            title,
            ext,
            path: filePath,
        };
    });

    if (pinyinSort) {
        fileArr.sort((f1, f2) => {
            const f1Pinyin = pingyin(f1.rawTitle).join('');
            const f2Pinyin = pingyin(f2.rawTitle).join('');
            return f1Pinyin.localeCompare(f2Pinyin);
        });
    }

    return fileArr;
}

module.exports = {
    loadAllTxtFileNames,
    loadToc,
};
