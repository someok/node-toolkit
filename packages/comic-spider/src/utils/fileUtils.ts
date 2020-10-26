import {childFiles, createTempFolder as createPrefixTempFolder} from '@someok/node-utils';
import _ from 'lodash';
import RemoteImage from '../spider/RemoteImage';

export function createTempFolder(): string {
    return createPrefixTempFolder('cs-');
}

/**
 * 给定文件夹是否已经下载过了
 *
 * @param toDir 目标路径
 * @param images 待下载图片列表
 */
export function isAlbumExist(toDir: string, images: RemoteImage[]): boolean {
    const files = childFiles(toDir, ['.txt']);
    if (_.isEmpty(files)) return false;
    if (_.isEmpty(images)) return true;

    return files.length === images.length;
}
