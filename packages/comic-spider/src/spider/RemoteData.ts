import RemoteImage from './RemoteImage';

export default class RemoteData {
    private _title: string;
    private _images: RemoteImage[];

    public constructor(title: string, images: RemoteImage[]) {
        this._title = title;
        this._images = images;
    }

    public get title(): string {
        return this._title;
    }

    public set title(value: string) {
        this._title = value;
    }

    public get images(): RemoteImage[] {
        return this._images;
    }

    public set images(value: RemoteImage[]) {
        this._images = value;
    }
}
