import siteData from '../177pic';

test.skip('fetchRemoteData', (done): Promise<void> => {
    jest.setTimeout(20000);
    expect.assertions(2);

    const url = 'http://www.177pic.info/html/2019/05/2934010.html';

    return siteData
        .fetchRemoteData(url)
        .then((data): void => {
            console.log(data);
            console.log(data.images.length);
            expect(data.title).toBe('[春輝] 妄想老師 Vol.2 [85P]');
            expect(data.images.length).toBe(85);
        })
        .catch((err): void => {
            console.log(err);
        })
        .finally((): void => {
            done();
        });
});
