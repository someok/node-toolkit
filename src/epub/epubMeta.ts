import Result from '@someok/node-utils/lib/Result';

import {loadToc} from './toc';
import {loadMetadataYaml} from '../metadata/yaml';
import {initMetadataByFoldderName} from '../metadata/metadata';
import Meta from '../metadata/Meta';
import TxtNode from '../utils/TxtNode';

interface MetaResult {
    meta: Meta;
    tocNodes: TxtNode[];
}

/**
 * 读取给定目录下的 meta 信息，如果不存在 __t2e.data 及下面的 yaml，则根据当前文件名自动生成。
 *
 * @param folder 目录
 * @return {Result} 返回 {@link Result}
 */
export function readMetadata(folder: string): Promise<MetaResult> {
    const tocResult = loadToc(folder);
    if (!tocResult.success) {
        return Promise.reject(new Error(tocResult.message));
    }

    // 如果 metaJson 信息不存在则创建，否则忽略
    return initMetadataByFoldderName(folder, {createCover: true}).then(() => {
        const meta = loadMetadataYaml(folder);
        return {
            meta,
            tocNodes: tocResult.data,
        };
    });
}
