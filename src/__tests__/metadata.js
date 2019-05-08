const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const yaml = require('js-yaml');

const metadata = require('../metadata');
const fileUtils = require('../utils/fileUtils');

const {METADATA_YAML, UUID_YAML, METADATA_FOLDER} = require('../context');

test('init', () => {
    // 临时文件夹
    const folder = fileUtils.createTempFolder();
    console.log(folder);

    const meta = {
        title: 'title',
        author: 'author',
        description: 'description',
    };

    metadata.init(folder, meta);

    const metadataFolder = path.resolve(folder, METADATA_FOLDER);
    const metadataYaml = path.resolve(metadataFolder, METADATA_YAML);
    const uuidYaml = path.resolve(metadataFolder, UUID_YAML);
    // console.log(metadataFolder);
    expect(fileUtils.existFolder(metadataFolder)).toBe(fileUtils.FolderMode.NORMAL);
    expect(fs.existsSync(metadataYaml)).toBeTruthy();
    expect(fs.existsSync(uuidYaml)).toBeTruthy();

    // 读取 yaml 文件
    const metadataJson = yaml.safeLoad(fs.readFileSync(metadataYaml));
    // console.log(metadataJson);
    expect(metadataJson).toEqual({...meta, version: '1.0.0'});

    const uuidJson = yaml.safeLoad(fs.readFileSync(uuidYaml));
    // console.log(uuidJson);
    expect(uuidJson).not.toBeUndefined();
    expect(typeof uuidJson).toBe('object');
    expect(uuidJson.uuid).not.toBeUndefined();

    // 删除临时文件夹
    expect(() => {
        fse.removeSync(folder);
    }).not.toThrow();
});
