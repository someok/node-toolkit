import uuidGen from 'uuid';

export default class Meta {
    private _title: string;
    private _author: string | undefined;
    private _description: string | undefined;
    // 封面名称
    private _cover: string | undefined;
    // 封面图片路径
    private _coverFile: string | undefined;
    // 是否自动生成的图片，如果是不是自动生成的图片可以在 meta 文件中将此值设置为 false，
    // 这样在重新生成的时候会忽略
    private _autoCover: boolean;
    private _uuid: string;
    private _version: string;

    constructor(
        title: string,
        author?: string,
        description?: string,
        cover?: string,
        id?: string,
        version?: string
    ) {
        this._description = description;
        this._title = title;
        this._author = author;
        this._cover = cover || 'cover.jpg';
        this._autoCover = true;
        this._uuid = id || uuidGen();
        this._version = version || '1.0.0';
    }

    toJson() {
        return {
            title: this.title,
            author: this.author || '',
            description: this.description || '',
            cover: this.cover || '',
            autoCover: this.autoCover,
            uuid: this.uuid,
            version: this.version,
        };
    }

    epubTitle() {
        return `${this.title}-v${this.version}.epub`;
    }

    static fromJson(json: {} | null) {
        // @ts-ignore
        const {title, author, description, cover, autoCover, uuid, version} = json || {};
        const meta = new Meta(title, author, description, cover, uuid, version);
        meta.autoCover = autoCover != false;
        return meta;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get author(): string | undefined {
        return this._author;
    }

    set author(value: string | undefined) {
        this._author = value;
    }

    get description(): string | undefined {
        return this._description;
    }

    set description(value: string | undefined) {
        this._description = value;
    }

    get cover(): string | undefined {
        return this._cover;
    }

    set cover(value: string | undefined) {
        this._cover = value;
    }

    get coverFile(): string | undefined {
        return this._coverFile;
    }

    set coverFile(value: string | undefined) {
        this._coverFile = value;
    }

    get autoCover(): boolean {
        return this._autoCover;
    }

    set autoCover(value: boolean) {
        this._autoCover = value;
    }

    get uuid(): string {
        return this._uuid;
    }

    set uuid(value: string) {
        this._uuid = value;
    }

    get version(): string {
        return this._version;
    }

    set version(value: string) {
        this._version = value;
    }
}
