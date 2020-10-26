import cheerio from 'cheerio';
import _ from 'lodash';
import path from 'path';
import fse from 'fs-extra';

import {SiteData} from './SiteData';
import RemoteData from '../spider/RemoteData';
import RemoteImage from '../spider/RemoteImage';
import {fetchAndOutputImages} from '../spider/output';
import {writeUrl2ReadmeTxt} from '../spider/readme';
import {isAlbumExist} from '../utils/fileUtils';

import {childDirs, logInfo} from '@someok/node-utils';
import {fetch} from '../spider/fetch';

interface AlbumItem {
    title: string;
    href: string;
}

interface AlbumInfo {
    title: string;
    author: string;
    items: AlbumItem[];
}

/**
 * 返回专辑信息，包括名称和子页面信息
 *
 * @param url
 */
function fetchAlbumInfo(url: string): Promise<AlbumInfo> {
    return fetch(url).then(
        ({body}): AlbumInfo => {
            const $ = cheerio.load(body);

            const el = $('.post-title > h1');
            el.find('span').remove();
            let title = el.text().trim();

            const pos = title.indexOf('[');

            // title = `[allporncomic] ${title}`;
            const author = title.substring(pos);
            title = title.substring(0, pos).trim();

            const items: AlbumItem[] = $('.wp-manga-chapter')
                .children('a')
                .map(
                    (index, element): AlbumItem => {
                        const $el = $(element);
                        const href = $el.attr('href');

                        if (!href) throw new Error('[href] not exist');
                        const title = $el
                            .text()
                            .trim()
                            .replace(author, '') // 删除 [] 中内容
                            .replace(/\s*-*\s*$/, ''); // 删除后面的横杆

                        return {title, href};
                    }
                )
                .get();

            items.reverse();

            return {
                title,
                author,
                items,
            };
        }
    );
}

async function fetchPageImages(
    albumnDir: string,
    title: string,
    href: string,
    overwrite: boolean
): Promise<boolean> {
    const {body} = await fetch(href);
    const $ = cheerio.load(body);
    const images: RemoteImage[] = $('.reading-content')
        .find('img')
        .map(
            (index, element): RemoteImage => {
                let url = $(element).attr('src')?.trim();

                if (!url) throw new Error('[data-lazy-src] not exist');

                const pos = url.indexOf('?');
                if (pos !== -1) {
                    url = url.substring(0, pos);
                }

                return new RemoteImage(url);
            }
        )
        .get();

    const toDir = path.resolve(albumnDir, title);

    if (!overwrite && isAlbumExist(toDir, images)) {
        logInfo(`${title} 已存在，此操作将忽略`);
        return true;
    }

    fse.ensureDirSync(toDir);
    logInfo(`fetch ${title} @ ${href}`);

    return await fetchAndOutputImages(toDir, images);
}

async function fetchAlbum(rootDir: string, url: string, overwrite: boolean): Promise<boolean> {
    const {title, author, items} = await fetchAlbumInfo(url);
    const subDir = `${author} ${title}`;
    const albumnDir = path.resolve(rootDir, subDir);

    const cdirs = childDirs(albumnDir);
    if (!overwrite) {
        if (!_.isEmpty(cdirs) && items.length === cdirs.length) {
            logInfo(`${subDir} 已存在，此操作将忽略`);
            return true;
        }
    }

    fse.ensureDirSync(albumnDir);
    writeUrl2ReadmeTxt(albumnDir, url);

    // 将 Promise 转换为顺序读取，否则会被服务器判断为蜘蛛从而拒绝访问
    let p = Promise.resolve(true);
    items.forEach(({title, href}) => {
        p = p.then(() => {
            console.log();
            return fetchPageImages(albumnDir, title, href, overwrite);
        });
    });

    return p;
}

async function updateAction(rootDir: string, urls: string[]): Promise<boolean> {
    let p = Promise.resolve(true);
    urls.forEach(url => {
        p = p.then(() => {
            return fetchAlbum(rootDir, url, false);
        });
    });
    return p;
}

/**
 * 此方法无用，只是个占位符
 *
 * @param url
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fetchRemoteData(url: string): Promise<RemoteData> {
    return Promise.resolve(new RemoteData('demo', []));
}

const siteData: SiteData = {
    fetchRemoteData,
    fetchAlong: fetchAlbum,
    updateAction,
    siteName: 'AllPornComic',
    urlCheckRegex: /^https:\/\/allporncomic\.com\/porncomic\/[\w\-]+\/?$/i,
};

export default siteData;
