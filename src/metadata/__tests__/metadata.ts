import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import yaml from 'js-yaml';

import metadataInit from '../metadata';
import Meta from '../Meta';
import {createTempFolder, existPath, PathMode} from '../../utils/fileUtils';

const {METADATA_YAML, METADATA_FOLDER} = require('../../context');

test('init', () => {
    // 临时文件夹
    const folder = createTempFolder();
    console.log(folder);

    const metaJson = {
        title: 'title',
        author: 'author',
        description: 'description',
    };

    const meta = Meta.fromJson(metaJson);
    metadataInit(folder, meta);

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
