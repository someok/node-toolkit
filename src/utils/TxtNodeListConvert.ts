import TxtNode from './TxtNode';

export function toNavMap(txtNodes: TxtNode[]): string {
    let ncx = '<navMap>\n';

    function travelNode(nodes: TxtNode[]): void {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const title = node.title;
            const {children} = node;

            const hasChildren = Array.isArray(children) && children.length > 0;
            ncx += '<navPoint>\n';

            if (node.chapterId) {
                ncx += `<navLabel><text>${title}</text></navLabel>\n`;
                // noinspection HtmlDeprecatedTag
                ncx += `<content src="${node.getHref()}"/>\n`;
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

export function toHtmlOrderList(txtNodes: TxtNode[]): string {
    let ol = '<ol>\n';

    function travelNode(nodes: TxtNode[]): void {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const title = node.title;
            const {children} = node;

            const hasChildren = Array.isArray(children) && children.length > 0;
            ol += '<li>\n';

            if (node.chapterId) {
                ol += `<a href="${node.getHref()}">${title}</a>\n`;
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
    path?: string;
}

export function toChapters(txtNodes: TxtNode[]): Chapter[] {
    const chapterIds: Chapter[] = [];
    TxtNode.travelTxtNodeTree(
        txtNodes,
        (node: TxtNode): void => {
            if (node.chapterId) {
                chapterIds.push({
                    id: node.getPadChapterId(),
                    title: node.title,
                    path: node.path,
                });
            }
        }
    );

    return chapterIds;
}
