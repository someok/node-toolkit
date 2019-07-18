class Result<T> {
    private readonly _success: boolean;
    private readonly _message: string | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _data: any;

    public constructor(success: boolean, message?: string, data?: T) {
        this._success = success;
        this._message = message;
        this._data = data;
    }

    public get success(): boolean {
        return this._success;
    }

    public get message(): string | undefined {
        return this._message;
    }

    public get data(): T {
        return this._data;
    }

    public set data(value: T) {
        this._data = value;
    }
}

export function success<T>(data?: T): Result<T> {
    return new Result<T>(true, undefined, data);
}

export function failure<T>(message: string): Result<T> {
    return new Result<T>(false, message);
}

export default Result;
