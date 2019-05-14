const _ = require('lodash');
const TxtNode = require('./TxtNode');

function getChapterId(index) {
    return _.padStart(index, 4, '0');
}

function getHref(index) {
    return `chapter-${getChapterId(index)}.xhtml`;
}

function toNavMap(txtNodes) {
    let ncx = '<navMap>\n';

    let index = 0;

    function travelNode(nodes) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const title = node.title;
            const {children} = node;

            const hasChildren = Array.isArray(children) && children.length > 0;
            ncx += '<navPoint>\n';

            if (node.path) {
                ncx += `<navLabel><text>${title}</text></navLabel>\n`;
                ncx += `<content src="${getHref(index++)}"/>\n`;
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

function toHtmlOrderList(txtNodes) {
    let ol = '<ol>\n';

    let index = 0;

    function travelNode(nodes) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const title = node.title;
            const {children} = node;

            const hasChildren = Array.isArray(children) && children.length > 0;
            ol += '<li>\n';

            if (node.path) {
                ol += `<a href="${getHref(index++)}">${title}</a>\n`;
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

function toChapters(txtNodes) {
    let index = 0;
    const chapterIds = [];
    TxtNode.travelTxtNodeTree(txtNodes, node => {
        if (node.path) {
            chapterIds.push({
                id: getChapterId(index++),
                title: node.title,
                path: node.path,
            });
        }
    });

    return chapterIds;
}

module.exports = {
    toNavMap,
    toHtmlOrderList,
    toChapters,
};
