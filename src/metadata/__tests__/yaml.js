const fse = require('fs-extra');

const yaml = require('../yaml');

const metadata = require('../metadata');
const Meta = require('../Meta');
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

    const meta = new Meta(META.title, META.author, META.description);
    metadata.init(folder, meta);
});

afterEach(() => {
    // 删除临时文件夹
    fse.removeSync(folder);
});

test('loadMetadataYaml', () => {
    const meta = yaml.loadMetadataYaml(folder);
    console.log(meta);
    expect(meta.toJson()).toEqual({...META, version: '1.0.0', uuid: meta.uuid});
});
