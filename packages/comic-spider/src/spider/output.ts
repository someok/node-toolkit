import _ from 'lodash';

import RemoteImage from './RemoteImage';
import {fetchImage, FetchStreamOptions} from './fetch';
import {logError, logSuccess, logWarning, truncateMiddle, waitting} from '@someok/node-utils';

interface FetchImageResult {
    success: boolean;
    image: RemoteImage;
    name: string;
    // 重试次数
    retryTimes?: number | 0;
    // 当重试超过最大次数后，放弃重试
    abandonRetry?: boolean;
}

function fetchImagePromise(
    toDir: string,
    image: RemoteImage,
    name: string,
    retryTimes = 0,
    fetchOptions: FetchStreamOptions = {}
): Promise<FetchImageResult> {
    return new Promise(resolve => {
        const trunUrl = truncateMiddle(image.url);
        // logInfo(`fetch img: ${trunUrl} => ${name}`);
        const {maxRetryTimes = 3} = fetchOptions;
        if (retryTimes >= maxRetryTimes) {
            logWarning(`failure: [${name}: ${image.url}] 读取失败，放弃重试！`);
            return resolve({success: true, image, name, retryTimes, abandonRetry: true});
        }

        return fetchImage(image.url, toDir, name, fetchOptions)
            .then(({localImgSize, remoteImgSize}): void => {
                if (localImgSize === remoteImgSize) {
                    const {minSize = 0} = fetchOptions;

                    if (localImgSize < minSize) {
                        logWarning(
                            `failure: [${name}: ${image.url}] size too small, local: ${localImgSize} < ${minSize}`
                        );
                        return resolve({success: false, image, name, retryTimes});
                    }

                    logSuccess(`save [${trunUrl}] => [${name}]`);
                    return resolve({success: true, image, name, retryTimes});
                } else {
                    logWarning(
                        `failure: [${name}: ${image.url}] size not match, local: ${localImgSize}, remote: ${remoteImgSize}`
                    );
                    return resolve({success: false, image, name, retryTimes});
                }
            })
            .catch((err): void => {
                logError(`err: [${image.url}]: ${err.message}`);
                return resolve({success: false, image, name, retryTimes});
            });
    });
}

/**
 * 递归 Promise 以重新获取那些失败的图片
 * @param toDir 目标路径
 * @param failureImages 失败的图片数组
 * @param fetchOptions
 */
function refetchFailureImages(
    toDir: string,
    failureImages: FetchImageResult[],
    fetchOptions: FetchStreamOptions = {}
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
            const promises = images.map(({image, name, retryTimes = 0}) =>
                fetchImagePromise(toDir, image, name, retryTimes, fetchOptions)
            );

            return Promise.all(promises).then(results => {
                results.forEach(value => {
                    // 重试时将 retryTimes 加 1
                    if (value.retryTimes !== null && value.retryTimes !== undefined) {
                        value.retryTimes++;
                    } else {
                        value.retryTimes = 1;
                    }
                });
                return refetchFailureImages(toDir, results, fetchOptions);
            });
        });
    });
}

/**
 * 批量存储图片。
 *
 * @param toDir 存储目录
 * @param images 图片列表
 * @param fetchOptions got 属性
 */
export function fetchAndOutputImages(
    toDir: string,
    images: RemoteImage[],
    fetchOptions: FetchStreamOptions = {}
): Promise<boolean> {
    if (_.isEmpty(images)) {
        logError('未能读取到任何图片文件');
        return Promise.reject('未能读取到任何图片文件');
    }

    const imagePromises = images.map(
        (image, index): Promise<FetchImageResult> => {
            const name = image.localName(index + 1);

            return fetchImagePromise(toDir, image, name, 0, fetchOptions);
        }
    );

    return Promise.all(imagePromises).then(results => {
        const failureResults = results.filter(result => !result.success);

        // 如果存在读取失败的图片，则重新进行递归读取，直到全部成功为止
        if (!_.isEmpty(failureResults)) {
            return refetchFailureImages(toDir, failureResults, fetchOptions)
                .then(() => true)
                .finally(() => {
                    logSuccess('refetch images success!');
                });
        } else {
            logSuccess(`fetch images success: ${results.length}`);
            return true;
        }
    });
}
