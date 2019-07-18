import _ from 'lodash';
import fse from 'fs-extra';

import RemoteImage from './RemoteImage';
import {fetchImage} from './fetch';
import {logInfo, logError, logWarning, logSuccess} from '@someok/node-utils';

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

    images.forEach((image, index): void => {
        const name = image.localName(index + 1);
        logInfo(`fetch img: ${image.url} => ${name}`);
        fetchImage(image.url, toDir, name)
            .then(({localImgSize, remoteImgSize}): void => {
                if (localImgSize === remoteImgSize) {
                    logSuccess(`save [${image.url}] => [${name}]`);
                } else {
                    logWarning(
                        `failure: [${image.url}] size not match, local: ${localImgSize}, remote: ${remoteImgSize}`
                    );
                }
            })
            .catch((err): void => {
                logError(`err: [${image.url}]: ${err.message}`);
            });
    });
}
