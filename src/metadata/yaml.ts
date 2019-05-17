import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

import Meta from './Meta';

const {METADATA_YAML, METADATA_FOLDER} = require('../context');

export function existMetadataYaml(folder: string): boolean {
    return fs.existsSync(path.resolve(folder, METADATA_FOLDER, METADATA_YAML));
}

/**
 * 读取给定目录下的 __t2e.data 下的 {@link METADATA_YAML}
 *
 * @param folder 目录
 * @return {Meta} {@link Meta} 对象
 */
export function loadMetadataYaml(folder: string): Meta {
    const buffer: Buffer = fs.readFileSync(path.resolve(folder, METADATA_FOLDER, METADATA_YAML));
    const metaJson = yaml.safeLoad(buffer.toString());
    return Meta.fromJson(metaJson);
}
