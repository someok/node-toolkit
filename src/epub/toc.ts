import path from 'path';
import fs from 'fs';
import klawSync from 'klaw-sync';
import _ from 'lodash';
import pingyin from 'pinyinlite';

import mdListParser from '../utils/marked/list2JsonParser';
import Result, {failure, success} from '../utils/result';
import {existPath, PathMode} from '../utils/fileUtils';
import TxtNode from '../utils/TxtNode';
import {METADATA_FOLDER, TOC_FILE} from '../context';

/**
 * 从给定文件夹中读取目录列表。
 *
 * 首先读取 toc.md 文件，如果此文件不存在，则读取 txt 文件名作为目录。
 *
 * @param folder 文件夹
 * @return {Result} 目录列表或错误信息
 */
export function loadToc(folder: string): Result {
    const tocPath = path.resolve(folder, METADATA_FOLDER, TOC_FILE);

    if (fs.existsSync(tocPath)) {
        return loadMdContentAsToc(folder, tocPath);
    }

    // 不存在 toc.md 文件，则直接读取 txt 文件名作为目录
    return loadTxtNamesAsToc(folder, true);
}

/**
 * 在 md 的树形列表中递归。
 *
 * @param {Array} nodes {@link TxtNode} 节点
 * @param {function} fn 遍历节点的时候执行的 callback 方法
 * @param level 树形层级，默认从 0 开始
 */
export function travelTxtNodeTree(nodes: TxtNode[], fn: Function, level: number = 0) {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const {children} = node;

        const hasChildren = Array.isArray(children) && children.length > 0;
        fn && fn(node, hasChildren, level);

        if (hasChildren) {
            travelTxtNodeTree(children, fn, level + 1);
        }
    }
}

/**
 * 在 md 的树形列表中递归，并设置每个节点的 path 属性，并判断此路径是否实际存在。
 *
 * @param folder 文件夹
 * @param {Array} nodes {@link TxtNode} 节点
 * @param {Array} notExistPath 不存在的节点路径
 */
function travelTree(folder: string, nodes: TxtNode[], notExistPath: string[]) {
    TxtNode.travelTxtNodeTree(nodes, (node: TxtNode, hasChildren: boolean) => {
        const {rawTitle} = node;
        const nodePath = rawTitle ? path.join(folder, rawTitle) : folder;
        const mode = existPath(nodePath);

        // 非分支节点允许非物理路径存在，也就是说父节点可以只作为标题存在
        // 此时 node.path 为空
        if (hasChildren) {
            if (mode === PathMode.IS_FILE) {
                node.path = nodePath;
            }
        } else {
            if (mode === PathMode.IS_FILE) {
                node.path = nodePath;
            } else {
                rawTitle && notExistPath.push(rawTitle);
            }
        }
    });
}

/**
 * 遍历 md toc 节点，并检测对应文件是否存在，不存在给出提示，存在则将 path 属性置入 Node
 *
 * @param folder txt 所在文件夹
 * @param mdFile toc.md 文件，markdown 列表格式
 * @return {Result} {@link TxtNode} 数组
 */
export function loadMdContentAsToc(folder: string, mdFile: string): Result {
    const mdName = path.basename(mdFile);
    let mdContent;
    try {
        mdContent = fs.readFileSync(mdFile);
    } catch (e) {
        return failure(`[${mdName}] 文件读取出现错误：${e.message}`);
    }

    mdContent = mdContent.toString().trim();
    if (!mdContent.trim()) return failure(`[${mdName}] 文件内容尚未定义`);

    const mdTocNodes: TxtNode[] | null = mdListParser(mdContent);
    if (!mdTocNodes || _.isEmpty(mdTocNodes)) return failure(`[${mdName}] 文件内容尚未定义`);

    // 递归遍历
    const notExistPath: string[] = [];
    travelTree(folder, mdTocNodes, notExistPath);

    if (!_.isEmpty(notExistPath)) {
        let msg = `[${mdName}] 中如下节点并不实际存在:\n`;
        notExistPath.forEach(dir => {
            msg += `    - ${dir}\n`;
        });
        return failure(msg);
    }

    return success(mdTocNodes);
}

/**
 * 文件过滤，支持 txt 扩展名。
 *
 * todo: 将来可以考虑增加 md 扩展名。
 *
 * @param item 文件路径
 * @return {boolean} 是否有效文本文件
 */
function txtFilter(item: klawSync.Item) {
    return ['.txt'].includes(path.extname(item.path).toLowerCase());
}

/**
 * 返回给定文件夹下所有 txt 文本文件名作为目录，并按照拼音排序。
 *
 * 如果文件名是 01_file_real_name.txt 格式，则会返回 file_real_name，前置的 01 用于排序。
 *
 * @param folder txt 文件夹
 * @param pinyinSort 是否按照拼音排序
 * @return {Result} txt 文件名构成的数组，条目为 {@link TxtNode}
 */
export function loadTxtNamesAsToc(folder: string, pinyinSort: boolean = false): Result {
    const files = klawSync(folder, {
        nodir: true,
        filter: txtFilter,
    });

    if (_.isEmpty(files)) {
        return failure('未发现任何文本文件');
    }

    const fileArr = files.map(file => {
        // 如果标题前面有数字（格式为：123__xxx），则去掉下划线及前置数字，只保留后面内容
        const re = /^(\d*_{2})?(.+)/g;

        const filePath = file.path;
        const ext = path.extname(filePath);
        const rawTitle = path.basename(filePath).trim();
        let title = path.basename(filePath, ext).trim();
        const match = re.exec(title);
        if (match) {
            // todo: 增加 html escape 处理
            title = match[2];
        }

        return new TxtNode(title, undefined, undefined, rawTitle, ext, filePath);
    });

    if (pinyinSort) {
        fileArr.sort((f1, f2) => {
            const f1Pinyin = pingyin(f1.rawTitle).join('');
            const f2Pinyin = pingyin(f2.rawTitle).join('');
            return f1Pinyin.localeCompare(f2Pinyin);
        });
    }

    return success(fileArr);
}
