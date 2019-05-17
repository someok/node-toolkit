import {getAuthor, getTitle} from '../utils/titleUtils';
import Result, {success} from '../utils/result';

import {loadToc} from './toc';
import {loadMetadataYaml} from '../metadata/yaml';
import metadataInit from '../metadata/metadata';
import Meta from '../metadata/Meta';

/**
 * 读取给定目录下的 meta 信息，如果不存在 __t2e.data 及下面的 yaml，则根据当前文件名自动生成。
 *
 * @param folder 目录
 * @return {Result} 返回 {@link Result}
 */
export function readMetadata(folder: string): Result {
    const tocResult = loadToc(folder);
    if (!tocResult.success) {
        return tocResult;
    }

    let metaJson = {
        title: getTitle(folder),
        author: getAuthor(folder),
        description: null,
    };
    // 如果 metaJson 信息不存在则创建，否则忽略
    const initResult = metadataInit(folder, Meta.fromJson(metaJson), false);
    if (!initResult.success) {
        return initResult;
    }

    const meta = loadMetadataYaml(folder);

    return success({
        meta,
        tocNodes: tocResult.data,
    });
};
