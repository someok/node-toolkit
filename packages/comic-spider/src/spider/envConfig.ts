import dotenv from 'dotenv';
import boxen from 'boxen';
import chalk from 'chalk';

import {getAbsolutePath} from '../utils/pathUtils';
import {existDir} from '@someok/node-utils';

/**
 * 在用户目录下读取 .someok-comic-spider-env 配置文件，此文件中配置了 COMIC_SPIDER_DATA_DIR 属性，
 * 用于定义下载图片的存储目录。
 *
 * 此方法执行之后会将 COMIC_SPIDER_DATA_DIR 置入 process.env。
 *
 * 也就是说通过调用 process.env.COMIC_SPIDER_DATA_DIR 即可得到相应目录配置。
 *
 * @param dotenvPath .env 文件路径
 */
export function readEnv(
    dotenvPath: string = '~/.comic-spider-env'
): dotenv.DotenvParseOutput | null {
    const envPath = getAbsolutePath(dotenvPath);
    const result = dotenv.config({path: envPath});

    if (result.error) {
        if (/ENOENT/.test(result.error.message)) {
            const msg = [
                `「${envPath}」 配置文件不存在`,
                '',
                '请创建此文件，并在其中设置图片存储路径：',
                'COMIC_SPIDER_DATA_DIR = /path/to/save/images',
            ].join('\n');

            const boxenOptions: boxen.Options = {
                padding: {left: 6, right: 6, top: 1, bottom: 1},
                borderStyle: boxen.BorderStyle.DoubleSingle,
                borderColor: 'redBright',
            };
            console.log(boxen(chalk.red(msg), boxenOptions));
        } else {
            throw result.error;
        }
        return null;
    }

    const env = result.parsed;
    if (!env || !env.COMIC_SPIDER_DATA_DIR) {
        throw new Error('COMIC_SPIDER_DATA_DIR 属性不存在');
    }

    return env;
}

/**
 * 用于检查 process.env.COMIC_SPIDER_DATA_DIR 配置的路径是否存在。
 *
 * 为防止配置错误，此文件夹并不会自动创建。
 *
 * 此方法需在 {@link readEnv} 之后执行。之所以未将其合并到 {@link readEnv}，主要是为了测试方便。
 */
export function existDataDir(): boolean {
    const dataDir = process.env.COMIC_SPIDER_DATA_DIR;
    if (dataDir) {
        return existDir(dataDir);
    } else {
        throw new Error('[COMIC_SPIDER_DATA_DIR] 属性未定义');
    }
}
