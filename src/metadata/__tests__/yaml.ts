import fse from 'fs-extra';

import {createTempFolder} from '@someok/node-utils/lib/fileUtils';
import {loadMetadataYaml} from '../yaml';
import {initMetadata} from '../metadata';
import Meta from '../Meta';

let folder: string;

const META = {
    title: 'title',
    author: 'author',
    description: 'description',
};

beforeEach(async () => {
    // 临时文件夹
    folder = createTempFolder();
    // console.log(`tmp folder: ${folder}`);

    const meta = new Meta(META.title, META.author, META.description);
    await initMetadata(folder, meta);
});

afterEach(() => {
    // 删除临时文件夹
    fse.removeSync(folder);
});

test('loadMetadataYaml', () => {
    const meta = loadMetadataYaml(folder);
    // console.log(meta);
    expect(meta.toJson()).toEqual({...META, cover: 'cover.jpg', version: '1.0.0', uuid: meta.uuid});
});
