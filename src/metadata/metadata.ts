import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import {existPath, PathMode} from '@someok/node-utils/lib/fileUtils';
import {logInfo, logWarning} from '@someok/node-utils/lib/logUtils';

import {METADATA_FOLDER, METADATA_YAML} from '../context';
import {getAuthor, getTitle} from '../utils/titleUtils';
import Meta from './Meta';
import {createCoverImage} from '../utils/coverImgUtils';

export function getMetadataFolder(folder: string) {
    return path.join(folder, METADATA_FOLDER);
}

interface InitMetadataProps {
    logMsg?: boolean;
    createCover?: boolean;
}

/**
 * 根据传入的元数据初始化 config.yml
 *
 * @param folder txt 根目录
 * @param meta epub 的基本 metadata, {@link Meta}
 * @param logMsg 是否在有异常的时候输出 log
 * @param createCover 是否创建封面图片
 */
export function initMetadata(
    folder: string,
    meta: Meta,
    {logMsg = true, createCover = false}: InitMetadataProps = {}
): Promise<Meta> {
    if (!meta) {
        return Promise.reject(new Error('[meta] 参数不能为空'));
    }

    const metadataFolder = getMetadataFolder(folder);
    if (existPath(metadataFolder) === PathMode.NOT_EXIST) {
        logMsg && logInfo(`创建目录 [${metadataFolder}]`);
        try {
            fs.mkdirSync(metadataFolder);
        } catch (e) {
            return Promise.reject(new Error(`${metadataFolder} 目录创建失败`));
        }
    }

    const metadataYaml = path.resolve(metadataFolder, METADATA_YAML);
    if (!fs.existsSync(metadataYaml)) {
        logMsg && logInfo(`初始化 [${METADATA_YAML}]`);
        const json = meta.toJson();
        const metaStr = yaml.safeDump(json);
        try {
            fs.writeFileSync(metadataYaml, metaStr);

            // 生成封面图片
            if (meta.cover && createCover) {
                const coverFile = path.join(metadataFolder, meta.cover);
                return createCoverImage(coverFile, meta).then(() => {
                    meta.coverFile = coverFile;
                    return meta;
                });
            }

            return Promise.resolve(meta);
        } catch (e) {
            return Promise.reject(new Error(`[${METADATA_YAML}] 创建失败`));
        }
    } else {
        logMsg && logWarning(`[${METADATA_YAML}] 已存在，忽略`);
        return Promise.resolve(meta);
    }
}

/**
 * 根据文件夹标题生成 metadata。
 *
 * @param folder 文件夹
 * @param logMsg 是否输出日志
 * @param createCover 是否创建封面图片
 */
export function initMetadataByFoldderName(
    folder: string,
    {logMsg = true, createCover = false}: InitMetadataProps = {}
): Promise<Meta> {
    const name = path.basename(folder);
    const meta = new Meta(getTitle(name), getAuthor(name));

    return initMetadata(folder, meta, {logMsg, createCover});
}
