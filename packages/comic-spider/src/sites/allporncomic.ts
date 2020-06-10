import cheerio from 'cheerio';

import {SiteData} from './SiteData';
import RemoteData from '../spider/RemoteData';
import {fetch} from '../spider/fetch';

import {commonFetchRemoteData, PageImages, Pages} from './multiPageFetch';

function fetchPages(url: string): Promise<Pages> {
    return fetch(url).then(
        ({body}): Pages => {
            const $ = cheerio.load(body);

            const el = $('.post-title > h1');
            el.find('span').remove();
            let title = el.text().trim();
            title = `[allporncomic] ${title}`;

            const hrefs = $('.wp-manga-chapter')
                .find('a')
                .map((index, element): string => {
                    const url = $(element).attr('href');

                    if (!url) throw new Error('[href] not exist');

                    return url;
                })
                .get();

            hrefs.reverse();

            return {
                title,
                hrefs,
            };
        }
    );
}

function fetchImagesByPage(pageUrl: string): Promise<PageImages> {
    return fetch(pageUrl).then(
        ({body}): PageImages => {
            const $ = cheerio.load(body);
            const images = $('.reading-content')
                .find('img')
                .map((index, element): string => {
                    let url = $(element).attr('data-src')?.trim();

                    if (!url) throw new Error('[data-lazy-src] not exist');

                    const pos = url.indexOf('?');
                    if (pos !== -1) {
                        url = url.substring(0, pos);
                    }

                    return url;
                })
                .get();

            return {
                pageUrl,
                images,
            };
        }
    );
}

function fetchRemoteData(url: string): Promise<RemoteData> {
    return commonFetchRemoteData(url, fetchPages, fetchImagesByPage);
}

const siteData: SiteData = {
    fetchRemoteData,
    siteName: 'AllPornComic',
    urlCheckRegex: /^https:\/\/allporncomic\.com\/porncomic\/[\w\-]+\/?$/i,
};
export default siteData;
