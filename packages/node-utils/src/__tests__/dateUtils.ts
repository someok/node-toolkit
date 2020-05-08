import dayjs from 'dayjs';
import * as dateUtils from '../dateUtils';

test('now', (): void => {
    const now = dateUtils.now();
    expect(('' + now).length).toBe(13);
    expect(('' + now).substr(0, 10)).toBe(('' + Date.now()).substring(0, 10));
});

test('toISOString', (): void => {
    const ts = dateUtils.now();
    let str = dateUtils.toISOString(ts);

    expect(str.includes(dayjs(ts).format('YYYY-MM-DD'))).toBeTruthy();
    expect(str.includes(dayjs(ts).format('HH:mm:ss'))).toBeTruthy();
    expect(str.includes('T')).toBeTruthy();
    expect(str.includes('Z')).toBeFalsy();
    // expect(str.includes('+08:00')).toBeTruthy();
    expect(str).toContain('+');
    expect(str).toContain(':00');

    const d = new Date();
    const datetime = dayjs(d).format('YYYY-MM-DDTHH:mm:ssZ');
    str = dateUtils.toISOString();
    expect(str.split('+')[0]).toBe(datetime.split('+')[0]);
});

test('formatDate', (): void => {
    // 2019-5-14
    const ts = 1557829291918;
    let d = dateUtils.formatDate(ts);
    expect(d).toBe('2019-05-14');

    d = dateUtils.formatDate();
    expect(d).toBe(dayjs().format('YYYY-MM-DD'));

    d = dateUtils.formatDate(ts, 'YYYY');
    expect(d).toBe('' + new Date(ts).getFullYear());
});

test('formatDateTime', (): void => {
    // 2019-5-14
    const ts = 1557829291918;
    let d = dateUtils.formatDateTime(ts);
    // console.log(d);
    // expect(d).toBe('2019-05-14 18:21');
    expect(d).toContain('2019-05-14 ');
    expect(d).toContain(':21');

    d = dateUtils.formatDateTime();
    expect(d).toBe(dayjs().format('YYYY-MM-DD HH:mm'));

    d = dateUtils.formatDateTime(ts, 'YYYY');
    expect(d).toBe('' + new Date(ts).getFullYear());
});
