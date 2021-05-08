import path from 'path';
import {existFile} from '@someok/node-utils/lib/fileUtils';
import _ from 'lodash';
import yaml from 'js-yaml';
import fs from 'fs';
import {logInfo, logWarning} from '@someok/node-utils/lib/logUtils';

import {subdirs} from '../utils/fileUtils';
import {existMetadataYaml, loadMetadataYaml} from './yaml';
import {getMetadataFolder, initMetadataByFoldderName} from './metadata';
import {createCoverImage} from '../utils/coverImgUtils';
import {METADATA_YAML} from '../context';

/**
 * 重新生成封面图片。
 *
 * @param dir txt 目录
 * @param overwrite 已存在封面图片，是否覆盖
 */
export function regenerateCover(dir: string, overwrite = true): Promise<boolean> {
    return new Promise<boolean>((resolve, reject): void => {
        const metaDir = getMetadataFolder(dir);

        if (existMetadataYaml(dir)) {
            // 已存在则先读取
            const meta = loadMetadataYaml(dir);
            let create = true;
            if (meta.cover) {
                const existCover = path.join(metaDir, meta.cover);
                if (existFile(existCover)) {
                    if (!overwrite) {
                        logWarning(`[${existCover}] 封面已存在，忽略`);
                        create = false;
                    } else if (!meta.autoCover) {
                        logWarning(`[${existCover}] 封面为用户维护，忽略`);
                        create = false;
                    }
                }
            }
            if (create) {
                meta.cover = 'cover.jpg';
                const existCover = path.join(metaDir, meta.cover);

                const metaFile = path.join(metaDir, METADATA_YAML);
                logInfo(`保存 [${metaFile}]`);
                const json = meta.toJson();
                const metaStr = yaml.dump(json);
                fs.writeFileSync(metaFile, metaStr);

                createCoverImage(existCover, meta)
                    .then((): void => {
                        meta.coverFile = existCover;
                        resolve(true);
                    })
                    .catch((err): void => {
                        reject(err);
                    });
            } else {
                resolve(true);
            }
        } else {
            // 不存在则使用文件夹名字创建 meta 信息
            initMetadataByFoldderName(dir, {createCover: true})
                .then((): void => {
                    resolve(true);
                })
                .catch((err): void => {
                    reject(err);
                });
        }
    });
}

export function regenerateAllCover(txtDir: string, overwrite = true): Promise<boolean> {
    const dirs = subdirs(txtDir);

    if (_.isEmpty(dirs)) {
        return Promise.reject(new Error(`[${txtDir}] 中没有子文件夹`));
    }

    const errMsg: string[] = [];

    // 顺序执行 Promise
    const seqPromise = dirs.reduce(function (promiseChain, dir): Promise<boolean> {
        return promiseChain.then(function (): Promise<boolean> {
            return regenerateCover(dir.path, overwrite)
                .then((): boolean => {
                    console.log();
                    return true;
                })
                .catch((err): boolean => {
                    errMsg.push(err.message);
                    return false;
                });
        });
    }, Promise.resolve(true));

    return seqPromise.then((): boolean => {
        if (!_.isEmpty(errMsg)) {
            throw new Error(errMsg.join('\n'));
        }

        return true;
    });
}
