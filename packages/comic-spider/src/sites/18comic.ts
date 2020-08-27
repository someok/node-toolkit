import cheerio from 'cheerio';

import {SiteData} from './SiteData';
import {fetch} from '../spider/fetch';
import RemoteData from '../spider/RemoteData';
import {parseTitle} from '../utils/comicUtils';
import {commonFetchRemoteData, PageImages, Pages} from './multiPageFetch';

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
            const images = $('.panel-body')
                .find('img')
                .map((index, element): string => {
                    let url = $(element).attr('data-original');
                    if (url) return url;

                    url = $(element).attr('src');
                    if (!url) throw new Error('[data-lazy-src] not exist');

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

async function fetchRemoteData(url: string): Promise<RemoteData> {
    return commonFetchRemoteData(url, fetchPages, fetchImagesByPage);
}

const siteData: SiteData = {
    fetchRemoteData,
    siteName: '18comic.vip',
    urlCheckRegex: /https:\/\/18comic\.vip\/album\/\d+\/.+/i,
};
export default siteData;
