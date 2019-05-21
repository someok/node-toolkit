import _ from 'lodash';

import TxtNode from './TxtNode';

function getChapterId(index: number) {
    return _.padStart('' + index, 4, '0');
}

function getHref(index: number) {
    return `chapter-${getChapterId(index)}.xhtml`;
}

export function toNavMap(txtNodes: TxtNode[]) {
    TxtNode.setChapterIds(txtNodes);

    let ncx = '<navMap>\n';

    function travelNode(nodes: TxtNode[]) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const title = node.title;
            const {children} = node;

            const hasChildren = Array.isArray(children) && children.length > 0;
            ncx += '<navPoint>\n';

            if (node.chapterId) {
                ncx += `<navLabel><text>${title}</text></navLabel>\n`;
                ncx += `<content src="${getHref(node.chapterId)}"/>\n`;
            } else {
                ncx += `<navLabel><text>${title}</text></navLabel>\n`;
            }

            if (hasChildren) {
                travelNode(children);
            }
            ncx += '</navPoint>';
        }
    }

    travelNode(txtNodes);

    ncx += '</navMap>';

    return ncx;
}

export function toHtmlOrderList(txtNodes: TxtNode[]) {
    TxtNode.setChapterIds(txtNodes);

    let ol = '<ol>\n';

    function travelNode(nodes: TxtNode[]) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const title = node.title;
            const {children} = node;

            const hasChildren = Array.isArray(children) && children.length > 0;
            ol += '<li>\n';

            if (node.chapterId) {
                ol += `<a href="${getHref(node.chapterId)}">${title}</a>\n`;
            } else {
                ol += `<span>${title}</span>`;
            }

            if (hasChildren) {
                ol += '<ol>\n';
                travelNode(children);
                ol += '</ol>\n';
            }
            ol += '</li>';
        }
    }

    travelNode(txtNodes);

    ol += '</ol>';
    return ol;
}

interface Chapter {
    id: string;
    title?: string;
    path: string;
}

export function toChapters(txtNodes: TxtNode[]) {
    let index = 0;
    const chapterIds: Chapter[] = [];
    TxtNode.travelTxtNodeTree(txtNodes, (node: TxtNode) => {
        if (node.path) {
            chapterIds.push({
                id: getChapterId(++index),
                title: node.title,
                path: node.path,
            });
        }
    });

    return chapterIds;
}
