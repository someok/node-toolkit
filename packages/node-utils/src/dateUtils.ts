import dayjs from 'dayjs';

const DATE_FORMAT = 'YYYY-MM-DD';
const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

export function now(): number {
    return Date.now ? Date.now() : +new Date();
}

/**
 * ISO8601 时间格式，格式为 yyyy-MM-ddTHH:mm:ss+08:00
 *
 * 使用的是当前时间加上时区偏移量。
 *
 * @param timestamp 时间戳
 */
export function toISOString(timestamp?: number): string {
    let ts;
    if (timestamp) {
        ts = timestamp;
    } else {
        ts = new Date().getTime();
    }

    return dayjs(ts).format('YYYY-MM-DDTHH:mm:ssZ');
}

export function format(timestamp: number, formatStr: string): string {
    return dayjs(timestamp).format(formatStr);
}

export function formatDate(
    timestamp: number = new Date().getTime(),
    formatStr: string = DATE_FORMAT
): string {
    return format(timestamp, formatStr);
}

export function formatDateTime(
    timestamp: number = new Date().getTime(),
    formatStr: string = DATETIME_FORMAT
): string {
    return format(timestamp, formatStr);
}
