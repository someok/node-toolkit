import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import klawSync from 'klaw-sync';
import {logWarning, existDir} from '@someok/node-utils';
import _ from 'lodash';

/**
 * 将解析的 url 保存到 readme.txt
 */
export function writeUrl2ReadmeTxt(parentDir: string, url: string): void {
    const filePath = path.join(parentDir, 'readme.txt');

    fs.writeFile(filePath, url, (err): void => {
        if (err) throw err;
        logWarning('readme.txt file saved!');
    });
}

/**
 * 查找给定文件夹下所有的 readme.txt 文件。
 *
 * @param parentDir 目标文件夹
 */
export function travelReadme(parentDir: string): ReadonlyArray<klawSync.Item> {
    if (!existDir(parentDir)) {
        return [];
    }

    function filter(item: klawSync.Item): boolean {
        return path.basename(item.path).toLowerCase() === 'readme.txt';
    }

    return klawSync(parentDir, {traverseAll: true, filter});
}

export function getAllReadmeContent(
    parentDir: string,
    filter: (data: string) => boolean
): string[] {
    const files = travelReadme(parentDir);
    if (_.isEmpty(files)) {
        return [];
    }

    const result = [];
    for (const file of files) {
        const filePath = file.path;
        const content = fs.readFileSync(filePath).toString();
        if (filter(content)) {
            result.push(content);
        }
    }
    return result;
}
