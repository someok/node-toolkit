import nock from 'nock';
import fse from 'fs-extra';
import path from 'path';

import {fetchImagesByPage, fetchPages} from '../18comic';

beforeEach(() => {
    nock.cleanAll();
});

test('18comic fetchPages with one pages', async () => {
    // jest.setTimeout(20000);
    expect.assertions(2);

    const html = fse.readFileSync(path.resolve(__dirname, 'demo/18comic-1-page.html'));

    nock('https://18comic.vip/')
        .get(/^\/album\/.+/)
        .reply(200, html);

    const url = 'https://18comic.vip/album/188046/abcd';

    const data = await fetchPages(url);
    // console.log(data);
    // console.log(data.images.length);
    expect(data.title).toBe('[aaaa] bbb・ [ccc] 06');
    expect(data.hrefs.length).toBe(1);

    // expect(data.images.length).toBe(26);
});

test('18comic fetchPages with multi pages', async () => {
    // jest.setTimeout(20000);
    expect.assertions(2);

    const html = fse.readFileSync(path.resolve(__dirname, 'demo/18comic-3-page.html'));

    nock('https://18comic.vip/')
        .get(/^\/album\/.+/)
        .reply(200, html);

    const url = 'https://18comic.vip/album/204870/abcd';

    const data = await fetchPages(url);
    // console.log(data);
    // console.log(data.images.length);
    expect(data.title).toBe('[aaaa] bbbb');
    expect(data.hrefs.length).toBe(3);
});

test('18comic fetch images url', async () => {
    expect.assertions(2);

    const html = fse.readFileSync(path.resolve(__dirname, 'demo/18comic-images.html'));

    nock('https://18comic.vip/')
        .get(/^\/album\/.+/)
        .reply(200, html);

    const url = 'https://18comic.vip/album/204870/abcd';

    const data = await fetchImagesByPage(url);
    // console.log(data);
    expect(data.pageUrl).toBe(url);
    expect(data.images.length).toBe(25);
});
