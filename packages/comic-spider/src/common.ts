import {existDataDir, readEnv} from './spider/envConfig';
import {logError} from '@someok/node-utils';

export function initEnv(): boolean {
    try {
        const env = readEnv();
        if (!env) return false;
    } catch (e) {
        logError(e.message);
        return false;
    }
    try {
        return existDataDir();
    } catch (e) {
        logError(e.message);
        return false;
    }
}

/**
 * 返回给定站点对应的存储地址，如果没有则使用默认的配置。
 *
 * 查找顺序（以 _177pic 为例）：
 *      1、COMIC_SPIDER_DATA_DIR_177PIC
 *      2、COMIC_SPIDER_DATA_DIR
 *
 * 注意：如果某个站点配置了独立的存储地址，配置时需注意命名，例如 _177pic，会去掉前面的下划线，并且将其转为大写，
 * 然后合并到 COMIC_SPIDER_DATA_DIR_ 后面。
 *
 * @param site 站点名称
 */
export function getDataDir(site: string): string {
    // 去掉开头的下划线
    const siteName = site.replace(/^_*/, '').toUpperCase();

    const envSites = [`COMIC_SPIDER_DATA_DIR_${siteName}`, 'COMIC_SPIDER_DATA_DIR'];
    for (const envSite of envSites) {
        const procEnv = process.env[envSite];
        if (procEnv) {
            return procEnv;
        }
    }

    throw new Error('COMIC_SPIDER_DATA_DIR 配置不存在');
}
