import fs from 'fs';
import {logError} from '@someok/node-utils/lib/logUtils';
import {Iconv} from 'iconv';
import klawSync from 'klaw-sync';
import path from 'path';
import {FOLDER_PREFIX} from '../context';

const gbk2utf8 = new Iconv('gbk', 'utf-8');
const big52utf8 = new Iconv('big5', 'utf-8');

/**
 * 读取 gbk 或 utf8 格式文件，由于 node 默认不支持 gbk，所以使用 Iconv 来做转换。
 *
 * gbk 或 big5 格式检测是使用 Iconv 的转换异常来处理，判断顺序如下：
 *    1、先用 gbk 编码转换成 utf8，如果抛出异常
 *    2、接着用 big5 编码转换成 utf8，如果抛出异常
 *    3、最后则表示为 utf8
 *
 * 这种搞法其实很不科学，可惜 node 里面判断编码的方式很讨厌，用了多个检测包都不好使。
 *
 * todo: 各种 encoding 的读取需要优化
 *
 * @param file 文件路径
 * @param debug true 的时候会输出异常信息
 * @return {string} 文件内容，utf8 格式
 */
export function readUtf8OrGbkReadFile(file: string, debug: boolean = false): string {
    const orignBuffer = fs.readFileSync(file);

    let covertedBuffer;
    try {
        covertedBuffer = gbk2utf8.convert(orignBuffer);
    } catch (e) {
        if (debug) {
            logError('gbk2utf8:');
            console.log(e);
        }

        try {
            covertedBuffer = big52utf8.convert(orignBuffer);
        } catch (e) {
            if (debug) {
                logError('big52utf8:');
                console.log(e);
            }

            covertedBuffer = orignBuffer;
        }
    }

    return covertedBuffer.toString();
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
