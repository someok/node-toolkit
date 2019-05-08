const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const yaml = require('js-yaml');
const chalk = require('chalk');

const ctx = require('./context');
const fileUtils = require('./utils/fileUtils');

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
        fs.mkdirSync(metadataFolder);
    }

    const metadataYaml = path.resolve(metadataFolder, METADATA_YAML);
    if (!fs.existsSync(metadataYaml)) {
        console.log(chalk.cyan(`初始化 ${METADATA_YAML}`));
        const epubMeta = {title, author, description, version: '1.0.0'};
        const metaStr = yaml.safeDump(epubMeta);
        // console.log(metaStr);
        try {
            fs.writeFileSync(metadataYaml, metaStr);
        } catch (e) {
            console.log(chalk.bold.red(`${METADATA_YAML} 创建失败`));
        }
    }

    const uuidYaml = path.resolve(metadataFolder, UUID_YAML);
    if (!fs.existsSync(uuidYaml)) {
        console.log(chalk.cyan(`初始化 ${UUID_YAML}`));
        const id = uuid();
        try {
            fs.writeFileSync(uuidYaml, `uuid: ${id}`);
        } catch (e) {
            console.log(chalk.bold.red(`${UUID_YAML} 创建失败`));
        }
    }
};
