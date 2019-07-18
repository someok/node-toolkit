import path from 'path';
import _ from 'lodash';

export default class RemoteImage {
    private _url: string;

    public constructor(url: string) {
        this._url = url;
    }

    /**
     * 返回给定 url 的本地名称，使用顺序号加前置 0 的格式。
     *
     * @param index 在数组中的顺序
     */
    public localName(index: number): string {
        const ext = path.extname(this._url);
        return _.padStart('' + index, 4, '0') + ext;
    }

    public get url(): string {
        return this._url;
    }

    public set url(value: string) {
        this._url = value;
    }
}
