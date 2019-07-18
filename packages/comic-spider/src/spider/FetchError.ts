export default class FetchError extends Error {
    private _statusCode: number;

    public constructor(statusCode: number, message?: string) {
        super(message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, FetchError);
        }

        if (!message) {
            this.message = `request has wrong status code: ${statusCode}`;
        }

        this._statusCode = statusCode;
    }

    public get statusCode(): number {
        return this._statusCode;
    }

    public set statusCode(value: number) {
        this._statusCode = value;
    }
}
