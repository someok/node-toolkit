import fse from 'fs-extra';
import {createTempFolder} from '../../utils/fileUtils';
import {fetchImage} from '../fetch';

test('fetchImage', (done): void => {
    expect.assertions(1);

    // const imgUrl = 'https://blah.me/cover/2294/cover.jpg';
    const imgUrl = 'https://pic2.zhimg.com/v2-56936833dd31ca0d7d504c4438e221f6_b.jpg';
    const tmpDir = createTempFolder();
    console.log(tmpDir);

    fetchImage(imgUrl, tmpDir, 'test.jpg')
        .then((resp): void => {
            // console.log(resp);
            expect(resp.remoteImgSize).toBe(resp.localImgSize);
        })
        .catch((err): void => {
            console.log(err);
        })
        .finally((): void => {
            fse.removeSync(tmpDir);
            done();
        });
});

test('fetchImage: retry 3 times for not exist remote image', (done): void => {
    jest.setTimeout(15000);
    expect.assertions(1);

    const tmpDir = createTempFolder();
    fetchImage('https://site-not-exist.com/not-exist.jpg', tmpDir, 'test.jpg').catch(
        (err): void => {
            // console.log(err);
            expect(err.code).toBe('ENOTFOUND');
            fse.removeSync(tmpDir);
            done();
        }
    );
});

test('fetchImage: not retry for 404 page', (done): void => {
    jest.setTimeout(15000);
    expect.assertions(1);

    const tmpDir = createTempFolder();
    fetchImage('https://github.com/request/request123/abc.png', tmpDir, 'test.png').catch(
        (err): void => {
            expect(err.message).toContain('404');
            fse.removeSync(tmpDir);
            done();
        }
    );
});
