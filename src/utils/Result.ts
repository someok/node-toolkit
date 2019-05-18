class Result<T> {
    private readonly _success: boolean;
    private readonly _message: string | undefined;
    private _data: any;

    constructor(success: boolean, message?: string, data?: T) {
        this._success = success;
        this._message = message;
        this._data = data;
    }

    get success() {
        return this._success;
    }

    get message() {
        return this._message;
    }

    get data(): T {
        return this._data;
    }

    set data(value: T) {
        this._data = value;
    }
}

export function success<T>(data?: T) {
    return new Result<T>(true, undefined, data);
}

export function failure<T>(message: string) {
    return new Result<T>(false, message);
}

export default Result;
