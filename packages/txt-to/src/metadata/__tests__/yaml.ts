import fse from 'fs-extra';

import {createTempFolder} from '../../utils/fileUtils';
import {loadMetadataYaml} from '../yaml';
import {initMetadata} from '../metadata';
import Meta from '../Meta';

let folder: string;

const META = {
    title: 'title',
    author: 'author',
    description: 'description',
};

beforeEach(
    async (): Promise<void> => {
        // 临时文件夹
        folder = createTempFolder();
        // console.log(`tmp folder: ${folder}`);
    }
);

afterEach((): void => {
    // 删除临时文件夹
    fse.removeSync(folder);
});

test('loadMetadataYaml', async (): Promise<void> => {
    let meta = new Meta(META.title, META.author, META.description);
    await initMetadata(folder, meta);

    meta = loadMetadataYaml(folder);
    // console.log(meta);
    expect(meta.toJson()).toEqual({
        ...META,
        cover: 'cover.jpg',
        titleSuffix: '',
        autoCover: true,
        version: '1.0.0',
        uuid: meta.uuid,
    });
});

test('loadMetadataYaml with autoCover false', async (): Promise<void> => {
    let meta = new Meta(META.title, META.author, META.description);
    meta.autoCover = false;
    await initMetadata(folder, meta);

    meta = loadMetadataYaml(folder);
    // console.log(meta);
    expect(meta.toJson()).toEqual({
        ...META,
        cover: 'cover.jpg',
        titleSuffix: '',
        autoCover: false,
        version: '1.0.0',
        uuid: meta.uuid,
    });
});
