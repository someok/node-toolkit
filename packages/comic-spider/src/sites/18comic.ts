import cheerio from 'cheerio';

import {SiteData} from './SiteData';
import {fetch} from '../spider/fetch';
import RemoteData from '../spider/RemoteData';
import {parseTitle} from '../utils/comicUtils';
import {commonFetchRemoteData, PageImages, Pages} from './multiPageFetch';
import path from 'path';
import _ from 'lodash';
import {logInfo, logSuccess, logWarning} from '@someok/node-utils';
import {isAlbumExist} from '../utils/fileUtils';
import fse from 'fs-extra';
import {writeUrl2ReadmeTxt} from '../spider/readme';
import {fetchAndOutputImages} from '../spider/output';
import Jimp from 'jimp';

const URL_BASE = 'https://18comic.vip';

export function fetchPages(url: string): Promise<Pages> {
    return fetch(url).then(
        ({body}): Pages => {
            const $ = cheerio.load(body);

            let title = $('.panel-heading > div').first().text();
            title = parseTitle(title);

            let hrefs: string[] = [];

            const $pages = $('.btn-toolbar');
            if ($pages.length === 0) {
                const href = $('.reading').first().attr('href');
                hrefs.push(`${URL_BASE}${href}`);
            } else {
                hrefs = $pages
                    .first()
                    .find('a')
                    .map((index, element): string => {
                        const url = $(element).attr('href');

                        if (!url) throw new Error('[href] not exist');

                        return `${URL_BASE}${url}`;
                    })
                    .get();
            }

            return {
                title,
                hrefs,
            };
        }
    );
}

export function fetchImagesByPage(pageUrl: string): Promise<PageImages> {
    return fetch(pageUrl).then(
        ({body}): PageImages => {
            const $ = cheerio.load(body);
            let images = $('.panel-body')
                .find('img')
                .map((index, element): string => {
                    const url = $(element).attr('data-original');
                    if (url) return url;

                    // url = $(element).attr('src');
                    // throw new Error('[src] not exist');
                    return '';
                })
                .get();

            images = images.filter(url => url !== '');

            return {
                pageUrl,
                images,
            };
        }
    );
}

/**
 * 此方法无用，只是个占位符
 *
 * @param url 略
 */
// eslint-disable-next-line
async function fetchRemoteData(url: string): Promise<RemoteData> {
    return Promise.resolve(new RemoteData('demo', []));
}

/**
 * 18comic 的图片做了防抓取处理，其图片纵向分隔成 10 份，并倒序拼接在一起，所以抓取之后
 * 需要重新调整顺序。
 *
 * 调整规则参照其网站的 JavaScript。
 *
 * 使用 jimp 的 crop 方法裁切原图片相应位置，然后使用 composite 将其合并到一起，最后输出到目标路径。
 *
 * @param imgPath 原图片路径
 * @param destImgPath 目标图片路径
 */
export async function adjustImage(imgPath: string, destImgPath: string): Promise<Jimp> {
    const image = await Jimp.read(imgPath);
    const width = image.getWidth();
    const height = image.getHeight();
    // console.log(image, width, height);

    const num = 10;
    const remainder = Math.floor(height % num);
    const corpHeight = Math.floor(height / 10);

    const destImage = image.clone();

    for (let i = 0; i < num; i++) {
        const newImage = image.clone();

        let copyH = corpHeight;
        let py = copyH * i;
        const y = height - copyH * (i + 1) - remainder;

        if (i === 0) {
            copyH = copyH + remainder;
        } else {
            py += remainder;
        }

        // console.log('copyH = ' + copyH, 'py = ' + py, 'y = ', y);
        // x, y, w, h
        newImage.crop(0, y, width, copyH);
        // console.log('new image', newImage.getWidth(), newImage.getHeight());
        destImage.composite(newImage, 0, py);
        // await newImage.writeAsync('/Users/wjx/temp/comic-spider/饥渴荡妇/dest' + i + '.jpg');
    }

    return await destImage.writeAsync(destImgPath);
}

async function fetchAlong(dataDir: string, url: string, overwrite: boolean): Promise<boolean> {
    const data = await commonFetchRemoteData(url, fetchPages, fetchImagesByPage);

    if (_.isEmpty(data) || _.isEmpty(data.images)) {
        logWarning('未获取任何图片数据');
        return false;
    }

    if (dataDir) {
        const toDir = path.join(dataDir, data.title);
        // 判断目标文件是否存在，如果存在则提示是否覆盖
        if (!overwrite && isAlbumExist(toDir, data.images)) {
            logInfo(`${data.title} 已存在，此操作将忽略`);

            return false;
        }

        fse.ensureDirSync(toDir);

        logInfo(`[${data.title}] 存储于 [${dataDir}]`);

        writeUrl2ReadmeTxt(toDir, url);

        // 当 url 中的 id 大于此值，需要调整图片，否则原图输出
        const scrambleId = 220980;
        let needAdjust = false;
        const m = url.match(/^https:\/\/18comic.vip\/album\/(\d+)\/?.*$/);
        if (m) {
            const id = parseInt(m[1], 10);
            needAdjust = id > scrambleId;
        }
        // console.log('needAdjust', needAdjust);

        const minSize = 10240;

        await fetchAndOutputImages(toDir, data.images, {
            thenFetchImage: ({localImgSize, imgFile}, image, name, retryTimes, trunUrl) => {
                return resolve => {
                    if (localImgSize < minSize) {
                        logWarning(
                            `failure: [${name}: ${image.url}] size too small, local: ${localImgSize} < ${minSize}`
                        );
                        return resolve({success: false, image, name, retryTimes});
                    }

                    logSuccess(`save [${trunUrl}] => [${name}]`);

                    if (needAdjust && !name.toLowerCase().endsWith('gif')) {
                        return adjustImage(imgFile, imgFile).then(() => {
                            return resolve({success: true, image, name, retryTimes});
                        });
                    }
                    return resolve({success: true, image, name, retryTimes});
                };
            },
        });

        return true;
    }

    return false;
}

const siteData: SiteData = {
    fetchRemoteData,
    fetchAlong,
    siteName: '18comic.vip',
    urlCheckRegex: /https:\/\/18comic\.vip\/album\/\d+\/?.*$/i,
};
export default siteData;
