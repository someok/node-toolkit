import path from 'path';
import os from 'os';
import fs from 'fs';
import createMode from 'stat-mode';
import klawSync from 'klaw-sync';
import _ from 'lodash';

export enum PathMode {
    // 文件夹且可写
    IS_DIRECTORY = 201,

    // 文件且可写
    IS_FILE = 202,

    // 不存在
    NOT_EXIST = 404,
    // 存在但不可写
    NOT_WRITE = 405,
}

/**
 * 判断给定路径属性，属性定义参见 {@link PathMode}。
 *
 * @param forPath 路径
 * @return {PathMode} 给定路径属性
 */
export function existPath(forPath: string): PathMode {
    try {
        const stat = fs.statSync(forPath);
        const mode = createMode(stat);

        if (!mode.owner.write) {
            return PathMode.NOT_WRITE;
        }

        if (stat.isDirectory()) {
            return PathMode.IS_DIRECTORY;
        } else if (stat.isFile()) {
            return PathMode.IS_FILE;
        }
    } catch (e) {
        // console.log(e);
    }
    return PathMode.NOT_EXIST;
}

/**
 * 判断给定路径是否为可写文件夹。
 *
 * @param forPath 路径
 * @return {boolean} 是否文件夹
 */
export function existDir(forPath: string): boolean {
    return PathMode.IS_DIRECTORY === existPath(forPath);
}

/**
 * 判断给定路径是否可写文件。
 *
 * @param forPath 路径
 * @return {boolean} 是否文件
 */
export function existFile(forPath: string): boolean {
    return PathMode.IS_FILE === existPath(forPath);
}

/**
 * 返回给定文件名，不包含扩展名。
 *
 * @param file 文件
 * @param includeExt 是否包含扩展名，默认不包含
 * @return {string} 文件名
 */
export function fileName(file: string, includeExt = false): string {
    if (includeExt) {
        return path.basename(file);
    }
    const ext = path.extname(file);
    return path.basename(file, ext);
}

/**
 * 创建 temp 文件夹。
 *
 * @param prefix 临时文件夹前缀
 */
export function createTempFolder(prefix: string): string {
    return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

/**
 * 返回给定文件夹下的所有文件（只返回一层，且不包括子文件夹）
 *
 * @param dir 目标文件夹
 * @param ignoreExt 忽略的文件格式，扩展名列表，内容需要小写
 */
export function childFiles(dir: string, ignoreExt: string[] = []): ReadonlyArray<klawSync.Item> {
    if (!existDir(dir)) {
        return [];
    }

    function filter(item: klawSync.Item): boolean {
        const ext = path.extname(item.path);

        if (_.isEmpty(ignoreExt)) {
            return true;
        }
        return !ignoreExt.includes(ext.toLowerCase());
    }

    return klawSync(dir, {nodir: true, filter});
}

/**
 * 返回给定文件夹下的子目录（只返回一层，且不包括子文件夹）
 * @param dir
 */
export function childDirs(dir: string): ReadonlyArray<klawSync.Item> {
    if (!existDir(dir)) {
        return [];
    }

    return klawSync(dir, {nofile: true, depthLimit: 1});
}
