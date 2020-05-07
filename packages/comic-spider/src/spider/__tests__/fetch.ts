import {fetch} from '../fetch';
import {readEnv} from '../envConfig';

test('fetch normal url', (done): void => {
    jest.setTimeout(20000);
    expect.assertions(1);

    readEnv();

    fetch('https://anytech.cn', {useAgent: false}).then(({resp}): void => {
        expect(resp.statusCode).toBe(200);
        done();
    });
});

test.skip('fetch gfw url', (done): void => {
    readEnv();

    fetch('https://zh.nyahentai.com/g/312210/').then(({body}): void => {
        console.log(body);
        expect(body).toContain('nyahentai');
        done();
    });
});

test('fetch 404 url', (done): void => {
    // jest.setTimeout(60000);
    expect.assertions(1);

    fetch('https://anytech.cn/request123').catch((err): void => {
        // console.log(err);
        expect(err.message).toContain('404');
        done();
    });
});

test('fetch not exist host', (done): void => {
    jest.setTimeout(15000);
    expect.assertions(1);

    fetch('https://this-is-not-exist-url.com', {useAgent: false}).catch((err): void => {
        // console.log(err);
        expect(err.code).toBe('ENOTFOUND');
        done();
    });
});
