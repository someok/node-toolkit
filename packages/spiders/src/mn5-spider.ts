//
// 抓取 https://www.mn5.cc/ 美图
//
import iconv from 'iconv-lite';
import got from 'got';
import cheerio from 'cheerio';
import stream from 'stream';
import {promisify} from 'util';
import _ from 'lodash';
import path from 'path';
import fse from 'fs-extra';
import RemoteImage from '@someok/comic-spider/src/spider/RemoteImage';
import {fetchAndOutputImages} from '@someok/comic-spider/src/spider/output';
import {writeUrl2ReadmeTxt} from '@someok/comic-spider/src/spider/readme';
import {childFiles, logError, logInfo} from '@someok/node-utils';

const pipeline = promisify(stream.pipeline);

const URL_ROOT = 'https://www.mn5.cc';
const PAGE_SIZE = 20;
/**
 * 读取网页并将其从 GB2312 转换成 utf8
 *
 * @param url 网页地址
 */
function fetchPage(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        return pipeline(
            got.stream(url),
            iconv
                .decodeStream('GB2312')
                .on('data', str => {
                    resolve(str);
                })
                .on('error', e => {
                    reject(e);
                })
        );
    });
}

interface AlbumGroup {
    /**
     * 写真集总数，每页是 20 个，通过此可以计算出页数。
     * 另外，第一页是 fetchAlbum 的给定 url，其它页的 url 格式为： url/page_{num}.html
     */
    total: number;
    totalPages: number;
    size: number;
    urls: string[];
}

/**
 * 读取写真集大类所有的分页地址。
 *
 * 例如 https://www.mn5.cc/Ugirls
 *
 * @param url 写真集大类 url
 */
function fetchAlbumGroupPages(url: string): Promise<AlbumGroup> {
    return fetchPage(url).then(body => {
        const $ = cheerio.load(body);
        const _total = $('.page strong').text();
        if (!_total) {
            throw new Error('not found total number');
        }

        const total = parseInt(_total, 10);
        const size = PAGE_SIZE;
        const totalPages = Math.floor((total - 1) / size + 1);

        const urls: string[] = [url];
        const _url = url.endsWith('/') ? url.substr(0, url.length - 1) : url;
        for (let i = 2; i <= totalPages; i++) {
            urls.push(`${_url}/page_${i}.html`);
        }
        return {total, size, totalPages, urls};
    });
}

/**
 * 读取大组给定分页下的所有写真集地址。
 *
 * @param url
 */
function fetchAlbumsByGroupPage(url: string): Promise<string[]> {
    return fetchPage(url).then(body => {
        const $ = cheerio.load(body);
        // const div = $('.biank1');
        // const href = div.find('a');
        return $('.biank1')
            .map((index, el) => {
                const $el = $(el);
                const a = $el.children('a');
                // const img = a.children('img');

                // console.log(index, a.attr('href'), img.attr('title'));
                return URL_ROOT + a.attr('href');
            })
            .get();
    });
}

interface AlbumPage {
    url: string;
    albums: string[];
}

/**
 * 读取写真集大组下所有分页上的内容，返回各个写真集的 URL 数组。
 *
 * @param urls
 */
function fetchGroupAlbums(urls: string[]): Promise<AlbumPage[]> {
    const albumsPromises = [];
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        albumsPromises.push(fetchAlbumsByGroupPage(url).then(albums => ({url, albums})));
    }

    return Promise.all(albumsPromises).then(value => {
        return _.flatten(value);
    });
}

interface AlbumPages {
    title: string;
    urls: string[];
}

/**
 * 读取写真集的标题和所有分页 URL。
 *
 * @param url
 */
function fetchAlbumPages(url: string): Promise<AlbumPages> {
    return fetchPage(url).then(body => {
        const $ = cheerio.load(body);
        const title = $('.title').text();
        const urls = $('.page')
            .first()
            .find('a')
            .map((index, element) => {
                const $el = $(element);
                // console.log($el.text());
                const text = $el.text();
                if (text.includes('前') || text.includes('后')) {
                    return null;
                }

                return URL_ROOT + $el.attr('href');
            })
            .get();

        return {title, urls};
    });
}

interface AlbumPageImages {
    url: string;
    imgUrls: string[];
}

/**
 * 读取写真集某页上的所有图片。
 *
 * @param url
 */
async function fetchAlbumPageImages(url: string): Promise<AlbumPageImages> {
    const body = await fetchPage(url);
    const $ = cheerio.load(body);

    const imgUrls = $('.img img')
        .map((index, element) => {
            const $img = $(element);
            return URL_ROOT + $img.attr('src');
        })
        .get();

    return {url, imgUrls};
}

interface Album {
    title: string;
    images: RemoteImage[];
}

/**
 * 返回给定写真集的标题和所有图片地址。
 *
 * @param url 写真集地址
 */
async function fetchAlbumMeta(url: string): Promise<Album> {
    const {title, urls} = await fetchAlbumPages(url);
    // console.log(title, urls);
    const promises = urls.map(url => fetchAlbumPageImages(url));
    const albumPicArr = await Promise.all(promises);

    // 将数组转换成以 url 为 key，图片 url 数组为值的对象格式
    const albumPicObj: {[key: string]: string[]} = {};
    albumPicArr.forEach(({url, imgUrls}) => {
        albumPicObj[url] = imgUrls;
    });

    let imgUrls: string[] = [];
    urls.forEach(url => {
        if (albumPicObj[url]) {
            imgUrls = imgUrls.concat(albumPicObj[url]);
        }
    });

    const images: RemoteImage[] = imgUrls.map(url => {
        return new RemoteImage(url);
    });

    return {title, images};
}

/**
 * 给定文件夹是否已经下载过了
 *
 * @param toDir 目标路径
 * @param images 待下载图片列表
 */
function isAlbumExist(toDir: string, images: RemoteImage[]) {
    const files = childFiles(toDir, ['.txt']);
    if (_.isEmpty(files)) return false;
    if (_.isEmpty(images)) return true;

    return files.length === images.length;
}

/**
 * 下载单个写真集中的所有图片。
 *
 * @param rootDir 目标路径
 * @param url 写真集地址
 * @param overwrite 是否覆盖
 */
export async function fetchAlbum(rootDir: string, url: string, overwrite = true): Promise<boolean> {
    try {
        return fetchAlbumInner(rootDir, url, overwrite);
    } catch (e) {
        logError(`Album ${url} 读取过程中出现错误：` + e.message);
        return fetchAlbumInner(rootDir, url, overwrite);
    }
}

async function fetchAlbumInner(rootDir: string, url: string, overwrite = true): Promise<boolean> {
    const {title, images} = await fetchAlbumMeta(url);
    const toDir = path.resolve(rootDir, title);

    if (!overwrite && isAlbumExist(toDir, images)) {
        logInfo(`${title} 已存在，此操作将忽略`);
        return true;
    }

    logInfo(`fetch ${title} @ ${url}`);

    fse.ensureDirSync(toDir);

    writeUrl2ReadmeTxt(toDir, url);
    return await fetchAndOutputImages(toDir, images, {
        useAgent: false,
        minSize: 30000,
        // fetchGap: 0.5, // 由于站点做了防抓取处理，所以这儿在每张图片读取之前做一下延迟处理
        fetchGapFun: () => {
            // 1秒内取随机数
            return Math.floor(_.random(0, 100)) / 100;
        },
        // fetchGapCallback: (sec: number) => {
        //     console.log(`gap: ${sec}s`);
        // },
        options: {headers: {Referer: url}},
    });
}

/**
 * 下载某个大类下的所有写真集
 *
 * @param rootDir
 * @param url
 * @param overwrite
 */
export async function fetchGroup(rootDir: string, url: string, overwrite = true): Promise<boolean> {
    const {urls} = await fetchAlbumGroupPages(url);
    const albumPages = await fetchGroupAlbums(urls);

    const albumUrls: string[] = [];
    albumPages.forEach(({albums}) => {
        albums.forEach(albumUrl => {
            // promises.push(fetchAlbum(rootDir, albumUrl));
            albumUrls.push(albumUrl);
        });
    });

    // console.log(albumUrls);
    // 将 Promise 转换为顺序读取，否则会被服务器判断为蜘蛛从而拒绝访问
    let p = Promise.resolve(true);
    albumUrls.forEach(albumUrl => {
        p = p.then(() => {
            console.log();
            return fetchAlbum(rootDir, albumUrl, overwrite);
        });
    });

    return p;
}

// fetchGroup('/Users/Shared/.ohmygod/已整理/mn5.cc', 'https://www.mn5.cc/tuigirl/', false).catch(e => {
//     console.log(e);
// });

// fetchAlbum(
//     '/Users/Shared/.ohmygod/已整理/mn5.cc',
//     'https://www.mn5.cc/Aiyouwu/Aiyouwu15495.html',
//     true
// ).catch(e => {
//     console.log(e);
// });
