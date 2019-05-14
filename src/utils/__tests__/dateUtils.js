const dateUtils = require('../dateUtils');

test('now', () => {
    const now = dateUtils.now();
    expect(('' + now).length).toBe(13);
    expect(('' + now).substr(0, 10)).toBe(('' + Date.now()).substring(0, 10));
});

test('toISOString', () => {
    const ts = dateUtils.now();
    const str = dateUtils.toISOString(ts);

    expect(str).toBe(new Date(ts).toISOString());
    expect(str.includes('T')).toBeTruthy();
    expect(str.includes('Z')).toBeTruthy();
});

test('formatDate', () => {
    // 2019-5-14
    const ts = 1557829291918;
    const d = dateUtils.formatDate(ts);
    expect(d).toBe('2019-05-14');
});
