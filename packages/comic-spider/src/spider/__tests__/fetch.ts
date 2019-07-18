import {fetch} from '../fetch';

test('fetch normal url', (done): void => {
    jest.setTimeout(20000);
    expect.assertions(1);

    fetch('https://github.com/request/request').then(({resp}): void => {
        expect(resp.statusCode).toBe(200);
        done();
    });
});

test('fetch 404 url', (done): void => {
    // jest.setTimeout(60000);
    expect.assertions(1);

    fetch('https://github.com/request/request123').catch((err): void => {
        console.log(err);
        expect(err.statusCode).toBe(404);
        done();
    });
});

test('fetch not exist host', (done): void => {
    jest.setTimeout(15000);
    expect.assertions(1);

    fetch('https://this-is-not-exist-url.com').catch((err): void => {
        expect(err.statusCode).toBe(777);
        done();
    });
});
