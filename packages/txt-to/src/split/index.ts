import klawSync from 'klaw-sync';
import path from 'path';
import _ from 'lodash';
import {logError, logInfo, logWarning} from '@someok/node-utils/lib/logUtils';
import {fileName} from '@someok/node-utils/lib/fileUtils';

import {readAsUtf8String} from '../utils/fileUtils';
import {splitAuto} from './splitTxtData';
import {outputChapters} from './outputTxt';
import {initMetadataByFoldderName} from '../metadata/metadata';

/**
 * 分割单个 txt 文件到目标文件夹。
 *
 * @param txtFile txt 文件路径
 * @param destFolder 目标文件夹
 * @param overwrite 如果目标文件夹已经存在是否覆盖，默认覆盖
 */
export function splitTxtFile2Dest(
    txtFile: string,
    destFolder: string,
    overwrite: boolean = true
): void {
    try {
        const txtResult = readAsUtf8String(txtFile);
        if (!txtResult.success) {
            logError(txtResult.message);
            return;
        }

        const chapters = splitAuto(txtResult.data);
        const {success, message} = outputChapters(chapters, destFolder, overwrite);

        if (success) {
            logInfo(`文本分隔完毕，目标文件位于 [${destFolder}]`);
        } else {
            message && logError(message);
        }

        // 生成 meta
        initMetadataByFoldderName(destFolder, {createCover: true}).catch((err): void => {
            logError(err.message);
        });
    } catch (e) {
        // console.log(e);
        logError(`文本分隔过程中出现错误：[${txtFile}]，Err: ${e.message}`);
    }
}

/**
 * 批量转换给定 txt 文件下的所有 txt 文件。
 *
 * @param txtFolder txt 文件夹
 * @param destFolder 目标文件夹
 * @param overwrite 是否覆盖已存在文件夹
 */
export function splitAllTxt2Dest(
    txtFolder: string,
    destFolder: string,
    overwrite: boolean = true
): void {
    function txtFilter(item: klawSync.Item): boolean {
        const ext = path.extname(item.path);
        return ext === '.txt';
    }

    const files = klawSync(txtFolder, {nodir: true, filter: txtFilter});
    if (_.isEmpty(files)) {
        logWarning(`[${txtFolder}] 中没有 txt 文件`);
        return;
    }

    files.forEach((file): void => {
        const name = fileName(file.path);
        const dest = path.resolve(destFolder, name);
        splitTxtFile2Dest(file.path, dest, overwrite);
    });
}
