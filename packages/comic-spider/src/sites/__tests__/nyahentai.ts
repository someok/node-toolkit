import nock from 'nock';
import fse from 'fs-extra';
import path from 'path';

import siteData from '../nyahentai';

const {fetchRemoteData} = siteData;

beforeEach(() => {
    nock.cleanAll();
});

test('nyahentai fetchRemoteData', async () => {
    // jest.setTimeout(20000);
    expect.assertions(2);

    const html = fse.readFileSync(path.resolve(__dirname, 'demo/nyahentai.html'));

    nock('https://zh.nyahentai.com')
        .get(/^\/g\/\d+/)
        .reply(200, html);

    const url = 'https://zh.nyahentai.com/g/269243/';

    const data = await fetchRemoteData(url);
    // console.log(data);
    // console.log(data.images.length);
    expect(data.title).toBe('demo');
    expect(data.images.length).toBe(26);
});
