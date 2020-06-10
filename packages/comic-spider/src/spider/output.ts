import _ from 'lodash';
import fse from 'fs-extra';

import RemoteImage from './RemoteImage';
import {fetchImage} from './fetch';
import {logError, logInfo, logSuccess, logWarning, waitting} from '@someok/node-utils';

interface FetchImageResult {
    success: boolean;
    image: RemoteImage;
    name: string;
}

function fetchImagePromise(
    toDir: string,
    image: RemoteImage,
    name: string
): Promise<FetchImageResult> {
    return new Promise(resolve => {
        logInfo(`fetch img: ${image.url} => ${name}`);
        return fetchImage(image.url, toDir, name)
            .then(({localImgSize, remoteImgSize}): void => {
                if (localImgSize === remoteImgSize) {
                    logSuccess(`save [${image.url}] => [${name}]`);
                    return resolve({success: true, image, name});
                } else {
                    logWarning(
                        `failure: [${image.url}] size not match, local: ${localImgSize}, remote: ${remoteImgSize}`
                    );
                    return resolve({success: false, image, name});
                }
            })
            .catch((err): void => {
                logError(`err: [${image.url}]: ${err.message}`);
                return resolve({success: false, image, name});
            });
    });
}

/**
 * 批量存储图片。
 *
 * @param toDir 存储目录
 * @param images 图片列表
 */
export function fetchAndOutputImages(toDir: string, images: RemoteImage[]): void {
    if (_.isEmpty(images)) {
        logError('未能读取到任何图片文件');
        return;
    }

    fse.ensureDirSync(toDir);

    const imagePromises = images.map(
        (image, index): Promise<FetchImageResult> => {
            const name = image.localName(index + 1);
            logInfo(`fetch img: ${image.url} => ${name}`);

            return fetchImagePromise(toDir, image, name);
        }
    );

    /**
     * 递归 Promise 以重新获取那些失败的图片
     * @param failureImages 失败的图片数组
     */
    function refetchFailureImages(
        failureImages: FetchImageResult[]
    ): Promise<FetchImageResult | true> {
        return new Promise(resolve => {
            if (_.isEmpty(failureImages)) return resolve(true);

            const images = failureImages.filter(({success}) => !success);
            if (_.isEmpty(images)) return resolve(true);

            console.log();
            logWarning('refetch failure images: ' + images.length);

            return waitting(1, (sec: number) => {
                logWarning(`waitting ${sec} seconds...`);
            }).then(() => {
                const promises = images.map(({image, name}) => {
                    return fetchImagePromise(toDir, image, name);
                });

                return Promise.all(promises).then(results => {
                    return refetchFailureImages(results);
                });
            });
        });
    }

    Promise.all(imagePromises).then(results => {
        const failureResults = results.filter(result => !result.success);
        // 如果存在读取失败的图片，则重新进行递归读取，直到全部成功为止
        if (!_.isEmpty(failureResults)) {
            refetchFailureImages(failureResults).then(value => {
                logSuccess(`refetch images success: ${value}!`);
            });
        } else {
            logSuccess(`fetch images success: ${results.length}`);
        }
    });
}
