import yaml from 'js-yaml';
import fs from 'fs';
import fse from 'fs-extra';

import {existDir} from '@someok/node-utils/lib/fileUtils';
import Result, {failure, success} from '@someok/node-utils/lib/Result';
import {closestFile} from './fileUtils';
import {EPUB_YAML} from '../context';

interface EpubYaml {
    saveTo: string;
}

/**
 * 从给定路径开始上溯查找 __epub.yaml 文件，并返回其中的 saveTo 属性
 */
export function readClosestEpubYaml(fromPath: string): Result<EpubYaml> {
    const closestResult = closestFile(fromPath, EPUB_YAML);
    if (!closestResult.success) {
        return failure('' + closestResult.message);
    }

    const yamlFile = closestResult.data;

    try {
        const buff = fs.readFileSync(yamlFile);
        const json = yaml.safeLoad(buff.toString()) as Record<string, string>;
        if (!json) {
            return failure(`[${yamlFile}] 不是合法的 YAML 格式`);
        }

        if (!json.saveTo) {
            return failure(`[${yamlFile}] 存在，但未定义正确的 [saveTo] 属性`);
        }

        if (!existDir(json.saveTo)) {
            fse.ensureDirSync(json.saveTo);
        }
        return success({saveTo: json.saveTo});
    } catch (e) {
        return failure(`[${yamlFile}] 存在，但未定义正确的 [saveTo] 属性`);
    }
}
