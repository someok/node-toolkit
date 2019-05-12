const uuidGen = require('uuid');

class Meta {
    constructor(title, author, description, id, version) {
        this._description = description;
        this._title = title;
        this._author = author;
        this._uuid = id || uuidGen();
        this._version = version || '1.0.0';
    }

    toJson() {
        return {
            title: this.title,
            author: this.author,
            description: this.description,
            uuid: this.uuid,
            version: this.version,
        };
    }

    static fromJson(json) {
        const {title, author, description, uuid, version} = json || {};
        return new Meta(title, author, description, uuid, version);
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get author() {
        return this._author;
    }

    set author(value) {
        this._author = value;
    }

    get description() {
        return this._description;
    }

    set description(value) {
        this._description = value;
    }

    get uuid() {
        return this._uuid;
    }

    set uuid(value) {
        this._uuid = value;
    }

    get version() {
        return this._version;
    }

    set version(value) {
        this._version = value;
    }
}

module.exports = Meta;
