const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const yaml = require('js-yaml');

const metadata = require('../metadata');
const Meta = require('../Meta');
const fileUtils = require('../../utils/fileUtils');

const {METADATA_YAML, METADATA_FOLDER} = require('../../context');

test('init', () => {
    // 临时文件夹
    const folder = fileUtils.createTempFolder();
    console.log(folder);

    const metaJson = {
        title: 'title',
        author: 'author',
        description: 'description',
    };

    const meta = Meta.fromJson(metaJson);
    metadata.init(folder, meta);

    const metadataFolder = path.resolve(folder, METADATA_FOLDER);
    const metadataYaml = path.resolve(metadataFolder, METADATA_YAML);
    // console.log(metadataFolder);
    expect(fileUtils.existFolder(metadataFolder)).toBe(fileUtils.FolderMode.NORMAL);
    expect(fs.existsSync(metadataYaml)).toBeTruthy();

    // 读取 yaml 文件
    const metadataJson = yaml.safeLoad(fs.readFileSync(metadataYaml));
    // console.log(metadataJson);
    expect(metadataJson).toEqual(meta.toJson());

    // 删除临时文件夹
    expect(() => {
        fse.removeSync(folder);
    }).not.toThrow();
});
