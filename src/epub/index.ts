import fse from 'fs-extra';
import path from 'path';
import _ from 'lodash';

import {logInfo} from '@someok/node-utils/lib/logUtils';
import {createTempFolder, existDir} from '@someok/node-utils/lib/fileUtils';
import {zipDir} from '@someok/node-utils/lib/zipUtils';

import {subdirs} from '../utils/fileUtils';
import {generate} from './generate';
import {readMetadata} from './epubMeta';
import Meta from '../metadata/Meta';

/**
 * 将给定 txt 文件夹转换为 epub 文件。
 *
 * @param txtDir txt 文件路径
 * @param epubPath 以 .epub 为扩展名表示文件路径，否则为所在目录，如果是后者，则用 meta 中定义的名称命名
 */
export function genTxtDir2Epub(txtDir: string, epubPath: string): Promise<Meta> {
    if (!txtDir) {
        return Promise.reject(new Error('必须明确 txt 文件夹'));
    }
    if (!existDir(txtDir)) {
        return Promise.reject(new Error(`[${txtDir}] 不是合法文件夹`));
    }
    if (!epubPath) {
        return Promise.reject(new Error('生成 epub 的路径必须明确'));
    }

    const tmpDir = createTempFolder();
    return new Promise<Meta>(function(resolve, reject): void {
        readMetadata(txtDir)
            .then(
                ({meta, tocNodes}): Promise<void> => {
                    generate(tmpDir, meta, tocNodes);

                    let epubFile: string;
                    if (epubPath.toLowerCase().endsWith('.epub')) {
                        epubFile = epubPath;
                    } else {
                        epubFile = path.join(epubPath, meta.epubTitle());
                    }

                    return zipDir(tmpDir, epubFile)
                        .then(
                            (): void => {
                                logInfo(`epub 生成生成：[${epubFile}]`);
                                resolve(meta);
                            }
                        )
                        .catch(
                            (err): void => {
                                reject(err);
                            }
                        );
                }
            )
            .catch(
                (err): void => {
                    reject(err);
                }
            )
            .finally(
                (): void => {
                    // 删除临时文件夹
                    fse.removeSync(tmpDir);
                }
            );
    });
}

export function genAllTxtDir2Epub(txtDir: string, epubPath: string): Promise<boolean> {
    const dirs = subdirs(txtDir);

    if (_.isEmpty(dirs)) {
        return Promise.reject(new Error(`[${txtDir}] 中没有子文件夹`));
    }

    const errMsg: string[] = [];

    // 顺序执行 Promise
    const seqPromise = dirs.reduce(function(promiseChain, dir): Promise<boolean> {
        return promiseChain.then(function(): Promise<boolean> {
            return genTxtDir2Epub(dir.path, epubPath)
                .then((): boolean => true)
                .catch(
                    (err): boolean => {
                        errMsg.push(err.message);
                        return false;
                    }
                );
        });
    }, Promise.resolve(true));

    return seqPromise.then(
        (): boolean => {
            if (!_.isEmpty(errMsg)) {
                throw new Error(errMsg.join('\n'));
            }

            return true;
        }
    );
}
