const fse = require('fs-extra');

const yaml = require('../yaml');

const metadata = require('../metadata');
const fileUtils = require('../../utils/fileUtils');

let folder;

const META = {
    title: 'title',
    author: 'author',
    description: 'description',
};

beforeEach(() => {
    // 临时文件夹
    folder = fileUtils.createTempFolder();
    console.log(`tmp folder: ${folder}`);

    metadata.init(folder, META);
});

afterEach(() => {
    // 删除临时文件夹
    fse.removeSync(folder);
});

test('loadMetadataYaml', () => {
    const json = yaml.loadMetadataYaml(folder);
    console.log(json);
    expect(json).toEqual({...META, version: '1.0.0'});
});

test('loadUuidYaml', () => {
    const uuidJson = yaml.loadUuidYaml(folder);
    console.log(uuidJson);
    expect(uuidJson).not.toBeUndefined();
    expect(typeof uuidJson).toBe('object');
    expect(uuidJson.uuid).not.toBeUndefined();
});
