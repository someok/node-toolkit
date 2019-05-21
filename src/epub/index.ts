import fse from 'fs-extra';
import path from 'path';
import klawSync from 'klaw-sync';
import _ from 'lodash';

import {log} from '../utils/logUtils';
import {createTempFolder, existDir} from '../utils/fileUtils';
import {zipDir} from '../utils/zipUtils';

import {generate} from './generate';
import {readMetadata} from './epubMeta';
import {FOLDER_PREFIX} from '../context';
import Meta from '../metadata/Meta';

/**
 * 将给定 txt 文件夹转换为 epub 文件。
 *
 * @param txtDir txt 文件路径
 * @param epubPath 以 .epub 为扩展名表示文件路径，否则为所在目录，如果是后者，则用 meta 中定义的名称命名
 * @return {Promise}
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

    const result = readMetadata(txtDir);
    if (!result.success) {
        return Promise.reject(new Error(result.message));
    }

    const {meta, tocNodes} = result.data;

    const tmpDir = createTempFolder();
    // console.log(tmpDir);
    generate(tmpDir, meta, tocNodes);

    let epubFile: string;
    if (epubPath.toLowerCase().endsWith('.epub')) {
        epubFile = epubPath;
    } else {
        epubFile = path.join(epubPath, meta.epubTitle());
    }

    return new Promise<Meta>(function(resolve, reject) {
        zipDir(tmpDir, epubFile)
            .then(() => {
                // 删除临时文件夹
                fse.removeSync(tmpDir);

                log(`epub 生成生成：[${epubFile}]`);
                resolve(meta);
            })
            .catch(err => {
                reject(err);
            });
    });
}

export function genAllTxtDir2Epub(txtDir: string, epubPath: string): Promise<boolean> {
    const dirs = klawSync(txtDir, {
        nofile: true,
        depthLimit: 0, // 只在给定目录下生成
        filter: function(item) {
            const dirName = path.basename(item.path);
            return !dirName.startsWith(FOLDER_PREFIX);
        },
    });

    if (_.isEmpty(dirs)) {
        return Promise.reject(new Error(`[${txtDir}] 中没有子文件夹`));
    }

    const errMsg: string[] = [];

    // 顺序执行 Promise
    const seqPromise = dirs.reduce(function(promiseChain, dir) {
        return promiseChain.then(function() {
            return genTxtDir2Epub(dir.path, epubPath)
                .then(() => true)
                .catch(err => {
                    errMsg.push(err.message);
                    return false;
                });
        });
    }, Promise.resolve(true));

    return seqPromise.then(() => {
        if (!_.isEmpty(errMsg)) {
            throw new Error(errMsg.join('\n'));
        }

        return true;
    });
}
