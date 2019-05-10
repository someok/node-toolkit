class Chapter {
    constructor(title, fromPos = 0, toPos = 0) {
        this._content = '';
        this._title = title;
        this._fromPos = fromPos;
        this._toPos = toPos;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get fromPos() {
        return this._fromPos;
    }

    set fromPos(value) {
        this._fromPos = value;
    }

    get toPos() {
        return this._toPos;
    }

    set toPos(value) {
        this._toPos = value;
    }

    get content() {
        return this._content;
    }

    set content(value) {
        this._content = value;
    }
}

module.exports = Chapter;
