import path from 'path';
import url from 'url';

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
        const _url = url.parse(this._url, false);
        if (_url.pathname) {
            const ext = path.extname(_url.pathname);
            return _.padStart('' + index, 4, '0') + ext;
        } else {
            throw new Error('image url pathname has problem');
        }
    }

    public get url(): string {
        return this._url;
    }

    public set url(value: string) {
        this._url = value;
    }
}
