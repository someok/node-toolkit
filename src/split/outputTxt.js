const path = require('path');
const _ = require('lodash');
const fse = require('fs-extra');
const {logWarn} = require('../utils/logUtils');
const {success, failure} = require('../utils/result');

exports.outputChapters = function(chapters, destFolder, overwrite = true) {
    if (_.isEmpty(chapters)) return failure('章节内容为空');

    if (fse.pathExistsSync(destFolder)) {
        if (overwrite) {
            // 如果目标文件夹已存在，则删除
            fse.removeSync(destFolder);
            logWarn('此文件夹已存在，覆盖！');
        } else {
            return failure(`${destFolder} 已存在，忽略`);
        }
    }

    for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];

        // 标题格式：00210__xxxx.txt
        // 前置数字用于排序
        const prefix = _.padStart(i, 4, '0');
        const title = `${prefix}0__${chapter.title}.txt`;

        const txtFile = path.resolve(destFolder, title);
        try {
            fse.outputFileSync(txtFile, chapter.content);
        } catch (e) {
            return failure(`${txtFile} 文件生成过程中出现错误：${e.message}`);
        }
    }

    return success();
};
