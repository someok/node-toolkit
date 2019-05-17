const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const ejs = require('ejs');
const _ = require('lodash');

const {toISOString, formatDate} = require('../utils/dateUtils');
const {existFile} = require('../utils/fileUtils');
const TxtNode = require('../utils/TxtNode');
const {toHtmlOrderList, toNavMap, toChapters} = require('../utils/TxtNodeListConvert');
const {travelTxtNodeTree} = require('./toc');

/**
 * 拷贝 epub boilerplate 目录到给定目录下。
 *
 * @param {Path|string} toDir 目标目录
 */
function copyBoilerplate(toDir) {
    const fromDir = path.resolve(__dirname, 'resources/boilerplate');
    fse.copySync(fromDir, toDir, {
        filter: function(a) {
            // 过滤掉以「.」开头的文件或文件夹
            return !path.basename(a).startsWith('.');
        },
    });
}

function genPackage(meta, itemIds) {
    const ejsFile = path.resolve(__dirname, 'resources/template/package.opf.ejs');

    return ejs.render(fs.readFileSync(ejsFile).toString(), {
        meta,
        date: {
            modified: toISOString(),
            date: formatDate(),
        },
        itemIds,
    });
}

function genNcxToc(meta, nodes) {
    const ejsFile = path.resolve(__dirname, 'resources/template/book/table-of-contents.ncx.ejs');
    const toc = toNavMap(nodes);
    return ejs.render(fs.readFileSync(ejsFile).toString(), {
        meta,
        nodes,
        toc,
    });
}

function genXhtmlToc(meta, nodes) {
    const ejsFile = path.resolve(__dirname, 'resources/template/book/table-of-contents.xhtml.ejs');
    const toc = toHtmlOrderList(nodes);
    return ejs.render(fs.readFileSync(ejsFile).toString(), {
        meta,
        nodes,
        toc,
    });
}

function genCover(meta) {
    const ejsFile = path.resolve(__dirname, 'resources/template/book/cover.xhtml.ejs');
    return ejs.render(fs.readFileSync(ejsFile).toString(), {
        meta,
    });
}

function readTxt(txtPath) {
    console.log(txtPath);
    // todo: 增加行转换为 p
    return fs.readFileSync(txtPath).toString();
}

function genChapter(title, content) {
    const ejsFile = path.resolve(__dirname, 'resources/template/book/content.xhtml.ejs');
    return ejs.render(fs.readFileSync(ejsFile).toString(), {
        title,
        content,
    });
}

function write2File(toFile, data) {
    fs.writeFileSync(toFile, data);
}

function generate(toDir, meta, txtNodes) {
    copyBoilerplate(toDir);

    const chapters = toChapters(txtNodes);
    console.log(chapters);

    const itemIds = chapters.map(item => item.id);

    write2File(path.resolve(toDir, 'OPS/package.opf'), genPackage(meta, itemIds));
    write2File(path.resolve(toDir, 'OPS/book/cover.xhtml'), genCover(meta));
    write2File(path.resolve(toDir, 'OPS/book/table-of-contents.ncx'), genNcxToc(meta, txtNodes));
    write2File(
        path.resolve(toDir, 'OPS/book/table-of-contents.xhtml'),
        genXhtmlToc(meta, txtNodes)
    );

    // todo: 生成 txt 对应 html
    chapters.forEach(chapter => {
        const content = readTxt(chapter.path);
        write2File(
            path.resolve(toDir, `OPS/book/chapter-${chapter.id}.xhtml`),
            genChapter(chapter.title, content)
        );
    });
}

module.exports = {
    copyBoilerplate,
    generate,
};
