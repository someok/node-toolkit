export default class Chapter {
    private _content: string;
    private _title: string;
    private _fromPos: number;
    private _toPos: number | undefined;

    public constructor(title: string, fromPos: number = 0, toPos?: number) {
        this._content = '';
        this._title = title;
        this._fromPos = fromPos;
        this._toPos = toPos || 0;
    }

    public get content(): string {
        return this._content;
    }

    public set content(value: string) {
        this._content = value;
    }

    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;
    }

    public get fromPos(): number {
        return this._fromPos;
    }

    public set fromPos(value: number) {
        this._fromPos = value;
    }

    public get toPos(): number | undefined {
        return this._toPos;
    }

    public set toPos(value: number | undefined) {
        this._toPos = value;
    }
}
