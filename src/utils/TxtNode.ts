import _ from 'lodash';
import htmlEscape from './htmlEscape';

export default class TxtNode {
    private _title: string | undefined;
    private _rawTitle: string | undefined;
    private _ext: string | undefined;
    private _path: string | undefined;
    // 节点指向的 txt 的索引号
    private _chapterId: number | undefined;
    private _desc: string | undefined;
    private _parent: TxtNode | undefined;
    private _children: TxtNode[] = [];
    private _level: number = 0;

    constructor(
        title?: string,
        desc?: string,
        parent?: TxtNode,
        rawTitle?: string,
        ext?: string,
        path?: string
    ) {
        this._title = TxtNode.validTitle(title);
        this._rawTitle = rawTitle;
        this._ext = ext;
        this._path = path;
        this._desc = desc;
        this._parent = parent;
    }

    static validTitle(title?: string): string {
        if (!title) {
            return '';
        }

        const t = title.trim();

        let ret = t;

        // 如果标题前面有数字（格式为：123__xxx），则去掉下划线及前置数字，只保留后面内容
        const titleRe = /(\d*_{2})?(.+)\.(txt|md)/i;
        const match = t.match(titleRe);
        if (match) {
            ret = match[2];
        }
        return htmlEscape(ret);
    }

    /**
     * 在 md 的树形列表中递归。
     *
     * @param {Array} nodes {@link TxtNode} 节点
     * @param {function} fn 遍历节点的时候执行的 callback 方法
     * @param level 树形层级，默认从 0 开始
     */
    static travelTxtNodeTree(
        nodes: TxtNode[],
        fn: (node: TxtNode, hasChildren: boolean, level: number) => void,
        level: number = 0
    ) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const {children} = node;

            const hasChildren = Array.isArray(children) && children.length > 0;
            fn && fn(node, hasChildren, level);

            if (hasChildren) {
                TxtNode.travelTxtNodeTree(children, fn, level + 1);
            }
        }
    }

    static setChapterIds(nodes: TxtNode[]) {
        let index = 0;
        // 首先遍历一次将所有存在实际路径的节点设置上 id
        // 如果某节点为父节点且不指向任何实际的文件，仍然生成一个 xhtml，不过里面内容只有标题
        TxtNode.travelTxtNodeTree(nodes, function(node) {
            node.chapterId = ++index;
        });

        // 再次遍历，将不存在 id 的节点的 id 指向最近的子节点的 id
        // TxtNode.travelTxtNodeTree(nodes, function(node, hasChildren) {
        //     if (!node.chapterId && hasChildren) {
        //         let childrenId: number;
        //         TxtNode.travelTxtNodeTree(node.children, function(cnode) {
        //             if (!childrenId && cnode.chapterId) {
        //                 childrenId = cnode.chapterId;
        //                 node.chapterId = childrenId;
        //             }
        //         });
        //     }
        // });
    }

    get title(): string | undefined {
        return this._title;
    }

    set title(value: string | undefined) {
        this._title = TxtNode.validTitle(value);
    }

    get rawTitle(): string | undefined {
        return this._rawTitle;
    }

    set rawTitle(value: string | undefined) {
        this._rawTitle = value;
    }

    get ext(): string | undefined {
        return this._ext;
    }

    set ext(value: string | undefined) {
        this._ext = value;
    }

    get path(): string | undefined {
        return this._path;
    }

    set path(value: string | undefined) {
        this._path = value;
    }

    get chapterId(): number | undefined {
        return this._chapterId;
    }

    set chapterId(value: number | undefined) {
        this._chapterId = value;
    }

    getPadChapterId(): string {
        return _.padStart('' + this.chapterId, 4, '0');
    }

    getHref(): string {
        return `chapter-${this.getPadChapterId()}.xhtml`;
    }

    get desc(): string | undefined {
        return this._desc;
    }

    set desc(value: string | undefined) {
        this._desc = value;
    }

    get parent(): TxtNode | undefined {
        return this._parent;
    }

    set parent(value: TxtNode | undefined) {
        this._parent = value;
    }

    get children(): TxtNode[] {
        return this._children;
    }

    set children(value: TxtNode[]) {
        this._children = value;
    }

    get level(): number {
        return this._level;
    }

    set level(value: number) {
        this._level = value;
    }
}
