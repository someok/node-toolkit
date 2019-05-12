const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

const Meta = require('./Meta');

const {METADATA_YAML, METADATA_FOLDER} = require('../context');

exports.existMetadataYaml = function(folder) {
    return fs.existsSync(path.resolve(folder, METADATA_FOLDER, METADATA_YAML));
};

/**
 * 读取给定目录下的 __t2e.data 下的 {@link METADATA_YAML}
 *
 * @param folder 目录
 * @return {Meta} {@link Meta} 对象
 */
exports.loadMetadataYaml = function loadMetadataYaml(folder) {
    const file = fs.readFileSync(path.resolve(folder, METADATA_FOLDER, METADATA_YAML));
    const metaJson = yaml.safeLoad(file);
    return Meta.fromJson(metaJson);
};
