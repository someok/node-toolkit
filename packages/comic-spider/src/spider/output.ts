import _ from 'lodash';
import fse from 'fs-extra';

import RemoteImage from './RemoteImage';
import {fetchImage} from './fetch';
import {
    logError,
    logInfo,
    logSuccess,
    logWarning,
    waitting,
    truncateMiddle,
} from '@someok/node-utils';

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
        const trunUrl = truncateMiddle(image.url);
        logInfo(`fetch img: ${trunUrl} => ${name}`);

        return fetchImage(image.url, toDir, name)
            .then(({localImgSize, remoteImgSize}): void => {
                if (localImgSize === remoteImgSize) {
                    logSuccess(`save [${trunUrl}] => [${name}]`);
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
 * 递归 Promise 以重新获取那些失败的图片
 * @param toDir 目标路径
 * @param failureImages 失败的图片数组
 */
function refetchFailureImages(
    toDir: string,
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
            const promises = images.map(({image, name}) => fetchImagePromise(toDir, image, name));

            return Promise.all(promises).then(results => {
                return refetchFailureImages(toDir, results);
            });
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

            return fetchImagePromise(toDir, image, name);
        }
    );

    Promise.all(imagePromises).then(results => {
        const failureResults = results.filter(result => !result.success);
        // 如果存在读取失败的图片，则重新进行递归读取，直到全部成功为止
        if (!_.isEmpty(failureResults)) {
            refetchFailureImages(toDir, failureResults).finally(() => {
                logSuccess('refetch images success!');
            });
        } else {
            logSuccess(`fetch images success: ${results.length}`);
        }
    });
}
