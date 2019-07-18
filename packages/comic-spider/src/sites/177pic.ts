import cheerio from 'cheerio';
import {fetch} from '../spider/fetch';
import RemoteImage from '../spider/RemoteImage';
import RemoteData from '../spider/RemoteData';
import {SiteData} from './SiteData';

interface Pages {
    title: string;
    hrefs: string[];
}

function fetchPages(url: string): Promise<Pages> {
    return fetch(url).then(
        ({body}): Pages => {
            const $ = cheerio.load(body);

            let title = $('h1.entry-title').text();
            title = title.replace('[中文]', '');

            const hrefs = $('.wp-pagenavi')
                .find('a')
                .map(function(index, element): string {
                    return $(element).attr('href');
                })
                .get();

            // 去掉最后一个重复页面
            hrefs.pop();
            hrefs.unshift(url);

            return {
                title,
                hrefs,
            };
        }
    );
}

interface PageImages {
    pageUrl: string;
    images: string[];
}

function fetchImagesByPage(pageUrl: string): Promise<PageImages> {
    return fetch(pageUrl).then(
        ({body}): PageImages => {
            const $ = cheerio.load(body);
            const images = $('.entry-content')
                .find('img')
                .map(function(index, element): string {
                    return $(element).attr('src');
                })
                .get();

            return {
                pageUrl,
                images,
            };
        }
    );
}

interface PageImagesPair {
    [key: string]: string[];
}

function fetchRemoteData(url: string): Promise<RemoteData> {
    return fetchPages(url)
        .then(
            (pages): Promise<RemoteData> => {
                const {title, hrefs} = pages;

                const promises = hrefs.map((href): Promise<PageImages> => fetchImagesByPage(href));
                return Promise.all(promises)
                    .then(
                        (allPageImages): PageImagesPair => {
                            const ret: PageImagesPair = {};
                            allPageImages.forEach((pageImages): void => {
                                ret[pageImages.pageUrl] = pageImages.images;
                            });

                            return ret;
                        }
                    )
                    .then(
                        (pageImagesObj): RemoteData => {
                            let ret: RemoteImage[] = [];
                            hrefs.forEach((href): void => {
                                const images = pageImagesObj[href];
                                const imgObjArr = images.map(
                                    (img): RemoteImage => {
                                        return new RemoteImage(img);
                                    }
                                );
                                ret = ret.concat(imgObjArr);
                            });
                            return new RemoteData(title.trim(), ret);
                        }
                    )
                    .catch((err): never => {
                        throw err;
                    });
            }
        )
        .catch((err): never => {
            throw err;
        });
}

const siteData: SiteData = {
    fetchRemoteData,
    siteName: '177pic.info',
    urlCheckRegex: /http:\/\/www.177pic.info\/html\/\d{4}\/\d{2}\/\d+\.html/i,
};
export default siteData;
