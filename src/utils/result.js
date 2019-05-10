class Result {
    constructor(success, message) {
        this._success = success;
        this._message = message;
    }

    get success() {
        return this._success;
    }

    get message() {
        return this._message;
    }
}

exports.success = function() {
    return new Result(true);
};

exports.failure = function(message) {
    return new Result(false, message);
};
