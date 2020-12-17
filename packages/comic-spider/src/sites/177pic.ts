import cheerio from 'cheerio';
import {fetch} from '../spider/fetch';
import RemoteData from '../spider/RemoteData';
import {SiteData} from './SiteData';
import {commonFetchRemoteData, PageImages, Pages} from './multiPageFetch';

function fetchPages(url: string): Promise<Pages> {
    return fetch(url).then(
        ({body}): Pages => {
            const $ = cheerio.load(body);

            let title = $('h1.entry-title').text();
            title = title.replace('[中文]', '');

            const hrefs = $('.page-links')
                .find('a')
                .map((index, element): string => {
                    const url = $(element).attr('href');

                    if (!url) throw new Error('[href] not exist');

                    return url;
                })
                .get();

            // 去掉首位两个重复页面
            hrefs.shift();
            hrefs.pop();
            // 将给定页添加到顶部
            hrefs.unshift(url);

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
            const images = $('.entry-content')
                .find('img')
                .map((index, element): string => {
                    const url = $(element).attr('data-lazy-src');

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

function fetchRemoteData(url: string): Promise<RemoteData> {
    return commonFetchRemoteData(url, fetchPages, fetchImagesByPage);
}

const siteData: SiteData = {
    fetchRemoteData,
    siteName: '177pic.info',
    urlCheckRegex: /http:\/\/www.177pic.info\/html\/\d{4}\/\d{2}\/\d+\.html$/i,
};
export default siteData;
