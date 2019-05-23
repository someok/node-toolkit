import Result, {success} from '@someok/node-utils/lib/Result';

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
export function readMetadata(folder: string): Result<MetaResult> {
    const tocResult = loadToc(folder);
    if (!tocResult.success) {
        return new Result<MetaResult>(false, tocResult.message);
    }

    // 如果 metaJson 信息不存在则创建，否则忽略
    const initResult = initMetadataByFoldderName(folder, false);
    if (!initResult.success) {
        return new Result<MetaResult>(false, initResult.message);
    }

    const meta = loadMetadataYaml(folder);

    return success({
        meta,
        tocNodes: tocResult.data,
    });
}
