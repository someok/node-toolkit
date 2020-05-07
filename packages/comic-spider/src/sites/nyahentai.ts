import cheerio from 'cheerio';

import {SiteData} from './SiteData';
import {fetch} from '../spider/fetch';
import RemoteData from '../spider/RemoteData';
import RemoteImage from '../spider/RemoteImage';

async function fetchRemoteData(url: string): Promise<RemoteData> {
    const images: RemoteImage[] = [];
    try {
        const {body} = await fetch(url);
        // console.log(body);
        const $ = cheerio.load(body);

        let title = $('#info h1').text();
        title = title.replace('[中国翻訳]', '');
        title = title.replace('[DL版]', '').trim();
        // console.log(title);

        const list = $('#thumbnail-container img')
            .map((index, element): string => {
                let url = $(element).attr('data-src');
                url = url.replace('t.nyahentai.net', 'i.nyahentai.net');
                url = url.replace('t.jpg', '.jpg');
                url = url.replace('t.png', '.png');
                return url;
            })
            .get();
        // console.log(list);

        list.forEach((url): void => {
            images.push(new RemoteImage(url));
        });
        return new RemoteData(title, images);
    } catch (e) {
        console.log(e);
        throw new Error('图片数据载入失败');
    }
}

const siteData: SiteData = {
    fetchRemoteData,
    siteName: '喵绅士',
    urlCheckRegex: /https:\/\/zh\.nyahentai\.com\/g\/\d+/i,
};
export default siteData;
