import uuidGen from 'uuid';
import _ from 'lodash';

interface MetaJson {
    title: string;
    author?: string;
    description?: string;
    cover?: string;
    autoCover?: boolean;
    uuid?: string;
    version?: string;
}

export default class Meta {
    private _title: string;
    private _author?: string;
    private _description?: string;
    // 封面名称
    private _cover?: string;
    // 封面图片路径
    private _coverFile?: string;
    // 是否自动生成的图片，如果是不是自动生成的图片可以在 meta 文件中将此值设置为 false，
    // 这样在重新生成的时候会忽略
    private _autoCover: boolean;
    private _uuid: string;
    private _version: string;

    public constructor(
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

    public toJson(): MetaJson {
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

    public epubTitle(): string {
        return `${this.title}-v${this.version}.epub`;
    }

    public static fromJson(json: MetaJson | null | undefined): Meta {
        if (!json || _.isEmpty(json)) {
            return new Meta('');
        }

        const {title, author, description, cover, autoCover, uuid, version} = json;
        const meta = new Meta(title, author, description, cover, uuid, version);
        // noinspection PointlessBooleanExpressionJS
        meta.autoCover = false !== autoCover;
        return meta;
    }

    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;
    }

    public get author(): string | undefined {
        return this._author;
    }

    public set author(value: string | undefined) {
        this._author = value;
    }

    public get description(): string | undefined {
        return this._description;
    }

    public set description(value: string | undefined) {
        this._description = value;
    }

    public get cover(): string | undefined {
        return this._cover;
    }

    public set cover(value: string | undefined) {
        this._cover = value;
    }

    public get coverFile(): string | undefined {
        return this._coverFile;
    }

    public set coverFile(value: string | undefined) {
        this._coverFile = value;
    }

    public get autoCover(): boolean {
        return this._autoCover;
    }

    public set autoCover(value: boolean) {
        this._autoCover = value;
    }

    public get uuid(): string {
        return this._uuid;
    }

    public set uuid(value: string) {
        this._uuid = value;
    }

    public get version(): string {
        return this._version;
    }

    public set version(value: string) {
        this._version = value;
    }
}
