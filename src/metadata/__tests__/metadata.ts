import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import yaml from 'js-yaml';
import {createTempFolder, existPath, PathMode} from '@someok/node-utils/lib/fileUtils';

import {initMetadata, initMetadataByFoldderName} from '../metadata';
import Meta from '../Meta';

const {METADATA_YAML, METADATA_FOLDER} = require('../../context');

test('initMetadata', () => {
    // 临时文件夹
    const folder = createTempFolder();
    // console.log(folder);

    const metaJson = {
        title: 'title',
        author: 'author',
        description: 'description',
    };

    const meta = Meta.fromJson(metaJson);
    initMetadata(folder, meta);

    const metadataFolder = path.resolve(folder, METADATA_FOLDER);
    const metadataYaml = path.resolve(metadataFolder, METADATA_YAML);
    // console.log(metadataFolder);
    expect(existPath(metadataFolder)).toBe(PathMode.IS_DIRECTORY);
    expect(fs.existsSync(metadataYaml)).toBeTruthy();

    // 读取 yaml 文件
    const metadataJson = yaml.safeLoad(fs.readFileSync(metadataYaml).toString());
    // console.log(metadataJson);
    expect(metadataJson).toEqual(meta.toJson());

    // 删除临时文件夹
    expect(() => {
        fse.removeSync(folder);
    }).not.toThrow();
});

test('initMetadataByFoldderName', () => {
    const tmpDir = createTempFolder();
    // console.log(tmpDir);

    const name = '《他改变了中国》作者：不认识【完结】';
    const dir = path.join(tmpDir, name);
    fse.ensureDirSync(dir);

    const result = initMetadataByFoldderName(dir);
    expect(result.success).toBeTruthy();

    const meta = result.data;
    // console.log(meta);
    expect(meta.title).toBe('《他改变了中国》');
    expect(meta.author).toBe('不认识【完结】');
    expect(meta.description).toBe(undefined);

    const json = meta.toJson();
    expect(json.description).toBe('');

    fse.removeSync(tmpDir);
});
