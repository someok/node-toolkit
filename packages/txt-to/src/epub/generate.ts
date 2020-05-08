import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import ejs from 'ejs';
import _ from 'lodash';

import {formatDate, toISOString} from '@someok/node-utils/lib/dateUtils';
import htmlEscape from '@someok/node-utils/lib/htmlEscape';
import TxtNode from '../utils/TxtNode';
import {toChapters, toHtmlOrderList, toNavMap} from '../utils/TxtNodeListConvert';
import Meta from '../metadata/Meta';

const EPUB_BOILERPLATE_ROOT = '../../epub-boilerplate';

/**
 * 拷贝 epub boilerplate 目录到给定目录下。
 *
 * @param {string} toDir 目标目录
 */
export function copyBoilerplate(toDir: string): void {
    const fromDir = path.resolve(__dirname, EPUB_BOILERPLATE_ROOT, 'boilerplate');
    fse.copySync(fromDir, toDir, {
        filter: function (a): boolean {
            // 过滤掉以「.」开头的文件或文件夹
            return !path.basename(a).startsWith('.');
        },
    });
}

function genPackage(meta: Meta, itemIds: string[]): string {
    const ejsFile = path.resolve(__dirname, EPUB_BOILERPLATE_ROOT, 'template/package.opf.ejs');

    return ejs.render(fs.readFileSync(ejsFile).toString(), {
        meta,
        date: {
            modified: toISOString(),
            date: formatDate(),
        },
        itemIds,
    });
}

function genNcxToc(meta: Meta, nodes: TxtNode[]): string {
    const ejsFile = path.resolve(
        __dirname,
        EPUB_BOILERPLATE_ROOT,
        'template/book/table-of-contents.ncx.ejs'
    );
    const toc = toNavMap(nodes);
    return ejs.render(fs.readFileSync(ejsFile).toString(), {
        meta,
        nodes,
        toc,
    });
}

function genXhtmlToc(meta: Meta, nodes: TxtNode[]): string {
    const ejsFile = path.resolve(
        __dirname,
        EPUB_BOILERPLATE_ROOT,
        'template/book/table-of-contents.xhtml.ejs'
    );
    const toc = toHtmlOrderList(nodes);
    return ejs.render(fs.readFileSync(ejsFile).toString(), {
        meta,
        nodes,
        toc,
    });
}

function genCover(toDir: string, meta: Meta): string | boolean {
    if (!meta.coverFile || !fs.existsSync(meta.coverFile)) {
        return false;
    }

    fse.copySync(meta.coverFile, path.join(toDir, `OPS/images/${meta.cover}`));
    const ejsFile = path.resolve(__dirname, EPUB_BOILERPLATE_ROOT, 'template/book/cover.xhtml.ejs');
    return ejs.render(fs.readFileSync(ejsFile).toString(), {
        meta,
    });
}

function readTxt(txtPath: string): string {
    // console.log(txtPath);
    // 增加行转换为 p
    let txt = fs.readFileSync(txtPath).toString();
    txt = _.trim(txt);
    if (!txt) return '';

    const lines = txt.split('\n');
    const results: string[] = [];
    lines.forEach((line): void => {
        let string = _.trim(line);
        string = htmlEscape(string);
        if (string) {
            results.push(`<p>${string}</p>`);
        }
    });

    return results.join('\n');
}

function genChapter(title: string, content: string): string {
    const ejsFile = path.resolve(
        __dirname,
        EPUB_BOILERPLATE_ROOT,
        'template/book/content.xhtml.ejs'
    );
    return ejs.render(fs.readFileSync(ejsFile).toString(), {
        title,
        content,
    });
}

function write2File(toFile: string, data: string | boolean): void {
    if (data === false) {
        return;
    }

    fs.writeFileSync(toFile, data);
}

export function generate(toDir: string, meta: Meta, txtNodes: TxtNode[]): void {
    copyBoilerplate(toDir);

    const chapters = toChapters(txtNodes);
    // console.log(chapters);

    const itemIds = chapters.map((item): string => item.id);

    write2File(path.resolve(toDir, 'OPS/package.opf'), genPackage(meta, itemIds));
    write2File(path.resolve(toDir, 'OPS/book/cover.xhtml'), genCover(toDir, meta));
    write2File(path.resolve(toDir, 'OPS/book/table-of-contents.ncx'), genNcxToc(meta, txtNodes));
    write2File(
        path.resolve(toDir, 'OPS/book/table-of-contents.xhtml'),
        genXhtmlToc(meta, txtNodes)
    );

    // 生成 txt 对应 html
    chapters.forEach((chapter): void => {
        const content = chapter.path ? readTxt(chapter.path) : '';
        if (!chapter.title) return;

        write2File(
            path.resolve(toDir, `OPS/book/chapter-${chapter.id}.xhtml`),
            genChapter(chapter.title, content)
        );
    });
}
