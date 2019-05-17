import klawSync from 'klaw-sync';
import path from 'path';
import _ from 'lodash';

import {fileName, readUtf8OrGbkReadFile} from '../utils/fileUtils';
import {log, logError, logWarn} from '../utils/logUtils';

import {splitAuto} from './splitTxt';
import {outputChapters} from './outputTxt';

/**
 * 分割单个 txt 文件到目标文件夹。
 *
 * @param txtFile txt 文件路径
 * @param destFolder 目标文件夹
 * @param overwrite 如果目标文件夹已经存在是否覆盖，默认覆盖
 */
export function splitTxtFile2Dest(txtFile: string, destFolder: string, overwrite: boolean = true) {
    try {
        const txt = readUtf8OrGbkReadFile(txtFile);
        const chapters = splitAuto(txt);
        const {success, message} = outputChapters(chapters, destFolder, overwrite);

        if (success) {
            log(`文本分隔完毕，目标文件位于 [${destFolder}]`);
        } else {
            message && logError(message);
        }
    } catch (e) {
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
export function splitAllTxt2Dest(txtFolder: string, destFolder: string, overwrite: boolean = true) {
    function txtFilter(item: klawSync.Item) {
        const ext = path.extname(item.path);
        return ext === '.txt';
    }

    const files = klawSync(txtFolder, {nodir: true, filter: txtFilter});
    if (_.isEmpty(files)) {
        logWarn(`[${txtFolder}] 中没有 txt 文件`);
        return;
    }

    files.forEach(file => {
        const name = fileName(file.path);
        const dest = path.resolve(destFolder, name);
        splitTxtFile2Dest(file.path, dest, overwrite);
    });
}
