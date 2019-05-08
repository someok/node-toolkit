const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const yaml = require('js-yaml');

const ctx = require('../context');
const fileUtils = require('../utils/fileUtils');
const {log, logError, logWarn} = require('../utils/logUtils');

const {METADATA_FOLDER, METADATA_YAML, UUID_YAML} = ctx;

/**
 * 根据传入的元数据初始化 config.yml、uuid.yml
 *
 * @param folder txt 根目录
 * @param meta epub 的基本 metadata
 */
exports.init = function(folder, meta) {
    const {title, author, description} = meta;

    const metadataFolder = path.resolve(folder, METADATA_FOLDER);
    if (fileUtils.existFolder(metadataFolder) === fileUtils.FolderMode.NOT_EXIST) {
        log(`创建目录 [${metadataFolder}]`);
        fs.mkdirSync(metadataFolder);
    }

    const metadataYaml = path.resolve(metadataFolder, METADATA_YAML);
    if (!fs.existsSync(metadataYaml)) {
        log(`初始化 [${METADATA_YAML}]`);
        const epubMeta = {title, author, description, version: '1.0.0'};
        const metaStr = yaml.safeDump(epubMeta);
        // console.log(metaStr);
        try {
            fs.writeFileSync(metadataYaml, metaStr);
        } catch (e) {
            logError(`[${METADATA_YAML}] 创建失败`);
        }
    } else {
        logWarn(`[${METADATA_YAML}] 已存在，忽略`);
    }

    const uuidYaml = path.resolve(metadataFolder, UUID_YAML);
    if (!fs.existsSync(uuidYaml)) {
        log(`初始化 [${UUID_YAML}]`);
        const id = uuid();
        try {
            fs.writeFileSync(uuidYaml, `uuid: ${id}`);
        } catch (e) {
            logError(`[${UUID_YAML}] 创建失败`);
        }
    } else {
        logWarn(`[${UUID_YAML}] 已存在，忽略`);
    }
};
