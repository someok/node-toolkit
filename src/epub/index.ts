import fse from 'fs-extra';
import path from 'path';

import {logError} from '../utils/logUtils';
import {createTempFolder, existPath, existDir} from '../utils/fileUtils';
import {zipDir} from '../utils/zipUtils';

import {generate} from './generate';
import {readMetadata} from './epubMeta';
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
        throw new Error('必须明确 txt 文件夹');
    }
    if (!existDir(txtDir)) {
        throw new Error(`[${txtDir}] 不是合法文件夹`);
    }
    if (!epubPath) {
        throw new Error('生成 epub 的路径必须明确');
    }

    const result = readMetadata(txtDir);
    if (!result.success) {
        logError(result.message);
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

                resolve(meta);
            })
            .catch(err => {
                reject(err);
            });
    });
}
