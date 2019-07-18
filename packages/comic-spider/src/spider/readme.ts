import path from 'path';
import fs from 'fs';
import {logWarning} from '@someok/node-utils';

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
