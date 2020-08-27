import url from 'url';
import path from 'path';
import _ from 'lodash';

test('image url', () => {
    const imageUrl = 'https://cdn-msp.18comic.org/media/photos/205820/00005.jpg?v=1597398692';
    const _url = url.parse(imageUrl, false);
    expect(_url.pathname).toBeDefined();
    expect(_url.pathname).not.toBeNull();

    if (_url.pathname) {
        expect(_url.pathname).toBe('/media/photos/205820/00005.jpg');

        const ext = path.extname(_url.pathname);
        expect(ext).toBe('.jpg');
        const title = _.padStart('' + 1, 4, '0') + ext;
        expect(title).toBe('0001.jpg');
    }
});
