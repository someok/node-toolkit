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
        this._title = title; // TxtNode.validTitle(title);
        this._rawTitle = rawTitle;
        this._ext = ext;
        this._path = path;
        this._desc = desc;
        this._parent = parent;
    }

    static validTitle(title: string): string {
        if (!title) {
            return '';
        }

        const t = title.trim();
        const titleRe = /(.+)\.(txt|md)/i;
        const match = t.match(titleRe);
        if (match) {
            return match[1];
        }
        return t;
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
        TxtNode.travelTxtNodeTree(nodes, function(node) {
            if (node.path) node.chapterId = ++index;
        });

        // 再次遍历，将不存在 id 的节点的 id 指向最近的子节点的 id
        TxtNode.travelTxtNodeTree(nodes, function(node, hasChildren) {
            if (!node.chapterId && hasChildren) {
                let childrenId: number;
                TxtNode.travelTxtNodeTree(node.children, function(cnode) {
                    if (!childrenId && cnode.chapterId) {
                        childrenId = cnode.chapterId;
                        node.chapterId = childrenId;
                    }
                });
            }
        });
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value; // TxtNode.validTitle(value);
    }

    get rawTitle() {
        return this._rawTitle;
    }

    set rawTitle(value) {
        this._rawTitle = value;
    }

    get ext() {
        return this._ext;
    }

    set ext(value) {
        this._ext = value;
    }

    get path() {
        return this._path;
    }

    set path(value) {
        this._path = value;
    }

    get chapterId(): number | undefined {
        return this._chapterId;
    }

    set chapterId(value: number | undefined) {
        this._chapterId = value;
    }

    get desc() {
        return this._desc;
    }

    set desc(value) {
        this._desc = value;
    }

    get parent() {
        return this._parent;
    }

    set parent(value) {
        this._parent = value;
    }

    get children() {
        return this._children;
    }

    set children(value) {
        this._children = value;
    }

    get level() {
        return this._level;
    }

    set level(value) {
        this._level = value;
    }
}
