import _ from 'lodash';

export function now(): number {
    return Date.now ? Date.now() : +new Date();
}

export function toISOString(timestamp?: number): string {
    if (timestamp) {
        return new Date(timestamp).toISOString();
    }

    return new Date().toISOString();
}

export function formatDate(timestamp?: number): string {
    let d: Date;
    if (timestamp) {
        d = new Date(timestamp);
    } else {
        d = new Date();
    }

    return `${d.getFullYear()}-${_.padStart('' + (d.getMonth() + 1), 2, '0')}-${_.padStart(
        '' + d.getDate(),
        2,
        '0'
    )}`;
}
