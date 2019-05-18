import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import yaml from 'js-yaml';

import {METADATA_FOLDER, METADATA_YAML} from '../context';
import {existPath, PathMode} from '../utils/fileUtils';
import Result, {failure, success} from '../utils/Result';
import {log, logError, logWarn} from '../utils/logUtils';
import {getAuthor, getTitle} from '../utils/titleUtils';
import Meta from './Meta';

/**
 * 根据传入的元数据初始化 config.yml
 *
 * @param folder txt 根目录
 * @param meta epub 的基本 metadata, {@link Meta}
 * @param logMsg 是否在有异常的时候输出 log
 * @return Result {@link success} 或 {@link failure}
 */
export function initMetadata(folder: string, meta: Meta, logMsg: boolean = true): Result<Meta> {
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
        const json = meta.toJson();
        const metaStr = yaml.safeDump(json);
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

/**
 * 根据文件夹标题生成 metadata。
 *
 * @param folder 文件夹
 * @param logMsg 是否输出日志
 */
export function initMetadataByFoldderName(folder: string, logMsg: boolean = true): Result<Meta> {
    const name = path.basename(folder);
    const meta = new Meta(getTitle(name), getAuthor(name));

    return initMetadata(folder, meta, logMsg);
}
