import siteData from '../nyahentai';
import {readEnv} from '../../spider/envConfig';

const {fetchRemoteData} = siteData;

test.skip('nyahentai fetchRemoteData', (done): Promise<void> => {
    readEnv();

    jest.setTimeout(20000);
    expect.assertions(2);

    const url = 'https://zh.nyahentai.com/g/269243/';

    return fetchRemoteData(url)
        .then((data): void => {
            // console.log(data);
            // console.log(data.images.length);
            expect(data.title).toBe('[トミヒロ、] 童貞の俺を誘惑するえっちな女子たち!? 3');
            expect(data.images.length).toBe(26);
        })
        .catch((err): void => {
            console.log(err);
        })
        .finally((): void => {
            done();
        });
});
