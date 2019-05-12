class Result {
    constructor(success, message, data) {
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

exports.success = function(data) {
    return new Result(true, null, data);
};

exports.failure = function(message) {
    return new Result(false, message);
};
