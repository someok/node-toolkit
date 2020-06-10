import RemoteData from '../spider/RemoteData';
import RemoteImage from '../spider/RemoteImage';

export interface Pages {
    title: string;
    hrefs: string[];
}

export interface PageImages {
    pageUrl: string;
    images: string[];
}

export interface PageImagesPair {
    [key: string]: string[];
}

/**
 * 部分网站有目录页，且目录页相应存在多张图片，可以使用本方法统一读取漫画标题和所有图片链接数组。
 *
 * @param url 入口页地址
 * @param fetchPages 根据 url 读取目录页地址
 * @param fetchImagesByPage 根据目录读取对应的所有图片地址
 */
export function commonFetchRemoteData(
    url: string,
    fetchPages: (url: string) => Promise<Pages>,
    fetchImagesByPage: (pageUrl: string) => Promise<PageImages>
): Promise<RemoteData> {
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
