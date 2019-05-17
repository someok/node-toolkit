class Result {
    private readonly _success: boolean;
    private readonly _message: string | undefined;
    private _data: any;

    constructor(success: boolean, message?: string, data?: any) {
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

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }
}

export function success(data?: any) {
    return new Result(true, undefined, data);
}

export function failure(message: string) {
    return new Result(false, message);
}

export default Result;
