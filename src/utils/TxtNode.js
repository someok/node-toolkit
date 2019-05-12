class TxtNode {
    constructor(title, desc, parent, rawTitle, ext, path) {
        this._title = title; // TxtNode.validTitle(title);
        this._rawTitle = rawTitle;
        this._ext = ext;
        this._path = path;
        this._desc = desc;
        this._parent = parent;
        this._children = [];
    }

    static validTitle(title) {
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

module.exports = TxtNode;
