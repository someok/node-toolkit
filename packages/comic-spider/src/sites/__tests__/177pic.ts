import nock from 'nock';
import fse from 'fs-extra';
import path from 'path';

import siteData from '../177pic';

beforeEach(() => {
    nock.cleanAll();
});

test('177pic fetchRemoteData', async () => {
    // jest.setTimeout(20000);
    expect.assertions(2);

    const html = fse.readFileSync(path.resolve(__dirname, 'demo/177pic.html'));

    nock('http://www.177pic.info')
        .get(/^\/html/)
        .times(4)
        .reply(200, html);

    const url = 'http://www.177pic.info/html/2019/05/2934010.html';

    const data = await siteData.fetchRemoteData(url);
    // console.log(data);
    // console.log(data.images.length);
    expect(data.title).toBe('demo [85P]');
    expect(data.images.length).toBe(6);
});
