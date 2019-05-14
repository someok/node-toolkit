const _ = require('lodash');

function now() {
    return Date.now ? Date.now() : +new Date();
}

function toISOString(timestamp) {
    if (timestamp) {
        return new Date(timestamp).toISOString();
    }

    return new Date().toISOString();
}

function formatDate(timestamp) {
    let d;
    if (timestamp) {
        d = new Date(timestamp);
    }
    d = new Date();

    return `${d.getFullYear()}-${_.padStart(d.getMonth() + 1, 2, '0')}-${_.padStart(
        d.getDate(),
        2,
        '0'
    )}`;
}

module.exports = {
    now,
    toISOString,
    formatDate,
};
