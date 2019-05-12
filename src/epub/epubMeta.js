const _ = require('lodash');
const {loadToc} = require('./toc');
const {getTitle, getAuthor} = require('../utils/titleUtils');
const {success, failure} = require('../utils/result');
const {loadMetadataYaml} = require('../metadata/yaml');
const {init} = require('../metadata/metadata');
const Meta = require('../metadata/Meta');

/**
 * 读取给定目录下的 meta 信息，如果不存在 __t2e.data 及下面的 yaml，则根据当前文件名自动生成。
 *
 * @param folder 目录
 * @return {Result} 返回 {@link Result}
 */
exports.readMetadata = function(folder) {
    const tocNodes = loadToc(folder);
    if (_.isEmpty(tocNodes)) {
        return failure('此文件内不存在任何 txt 文本文件');
    }

    let metaJson = {
        title: getTitle(folder),
        author: getAuthor(folder),
        description: null,
    };
    // 如果 metaJson 信息不存在则创建，否则忽略
    const initResult = init(folder, Meta.fromJson(metaJson), false);
    if (!initResult.success) {
        return initResult;
    }

    const meta = loadMetadataYaml(folder);

    return success({
        meta,
        tocNodes,
    });
};
