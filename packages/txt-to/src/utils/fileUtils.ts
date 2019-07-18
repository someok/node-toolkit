import fs from 'fs';
import path from 'path';
import klawSync from 'klaw-sync';
import chardet from 'chardet';
import encoding from 'encoding';
import {createTempFolder as tempFolder} from '@someok/node-utils/lib/fileUtils';
import Result from '@someok/node-utils/lib/Result';

import {FOLDER_PREFIX} from '../context';

export function createTempFolder(): string {
    return tempFolder('t2e-');
}

/**
 * 返回给定目录的子目录，默认只返回下一级目录。
 *
 * @param dir 给定目录
 * @param depthLimit 目录层级，-1 表示返回所有层级，默认只返回下一级
 */
export function subdirs(dir: string, depthLimit: number = 0): readonly klawSync.Item[] {
    return klawSync(dir, {
        nofile: true,
        depthLimit, // 只在给定目录下生成
        filter: function(item): boolean {
            const dirName = path.basename(item.path);
            return !dirName.startsWith(FOLDER_PREFIX);
        },
    });
}

const SUPPORTED_ENCODEING = ['UTF-8', 'GB18030', 'GB2312', 'Big5'];

/**
 * 检测给定文件是否是符合条件的编码。
 *
 * @param file 文件路径
 */
export function checkEncodeing(file: string): Result<string> {
    // 为减少内存占用，只读取 100 个字符用于比对
    const charset = chardet.detectFileSync(file, {sampleSize: 100});
    let isSupport = false;
    let data: string | undefined;
    if (charset && typeof charset === 'string' && SUPPORTED_ENCODEING.includes(charset)) {
        isSupport = true;
        data = charset;
    }

    return new Result<string>(isSupport, '不是支持的编码', data);
}

/**
 * 读取给定文本文件，并检测编码，如果是支持的编码则转换为 utf8，否则返回错误提示。
 *
 * @param file 文件路径
 */
export function readAsUtf8String(file: string): Result<string> {
    const encResult = checkEncodeing(file);
    if (!encResult.success) {
        return encResult;
    }

    let buff = fs.readFileSync(file);
    buff = encoding.convert(buff, 'UTF-8', encResult.data, true);

    return new Result<string>(true, undefined, buff.toString());
}

/**
 * 从给定路径 fromPath 开始上溯（一直上溯到根路径），查找是否存在给定文件。
 *
 * @param fromPath 上溯起始路径
 * @param fileName 查找的文件名
 */
export function closestFile(fromPath: string, fileName: string): Result<string> {
    let from = path.resolve(fromPath);
    let filePath: string;
    do {
        filePath = path.join(from, fileName);
        if (fs.existsSync(filePath)) {
            return new Result<string>(true, undefined, filePath);
        }
        from = path.dirname(from);
    } while (from !== path.dirname(from)); // 在根路径的时候 dirname 返回值不变

    return new Result<string>(false, `[${fileName}] 不存在`);
}
