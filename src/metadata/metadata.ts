import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';

import {METADATA_FOLDER, METADATA_YAML} from '../context';
import {existPath, PathMode} from '../utils/fileUtils';
import Result, {failure, success} from '../utils/result';
import {log, logError, logWarn} from '../utils/logUtils';

import Meta from './Meta';

/**
 * 根据传入的元数据初始化 config.yml
 *
 * @param folder txt 根目录
 * @param meta epub 的基本 metadata, {@link Meta}
 * @param logMsg 是否在有异常的时候输出 log
 * @return Result {@link success} 或 {@link failure}
 */
export default function init(folder: string, meta: Meta, logMsg: boolean = true): Result {
    if (!meta) {
        logError('[meta] 参数不能为空');
    }

    const metadataFolder = path.resolve(folder, METADATA_FOLDER);
    if (existPath(metadataFolder) === PathMode.NOT_EXIST) {
        log(`创建目录 [${metadataFolder}]`);
        try {
            fs.mkdirSync(metadataFolder);
        } catch (e) {
            logMsg && logError(`${metadataFolder} 目录创建失败`);
            return failure(`${metadataFolder} 目录创建失败`);
        }
    }

    const metadataYaml = path.resolve(metadataFolder, METADATA_YAML);
    if (!fs.existsSync(metadataYaml)) {
        log(`初始化 [${METADATA_YAML}]`);
        const metaStr = yaml.safeDump(meta.toJson());
        // console.log(metaStr);
        try {
            fs.writeFileSync(metadataYaml, metaStr);
        } catch (e) {
            logMsg && logError(`[${METADATA_YAML}] 创建失败`);
            return failure(`[${METADATA_YAML}] 创建失败`);
        }
    } else {
        logWarn(`[${METADATA_YAML}] 已存在，忽略`);
    }

    return success(meta);
}
