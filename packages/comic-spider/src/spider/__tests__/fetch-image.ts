import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import {createTempFolder} from '../../utils/fileUtils';
import {fetchImage, fetchStream} from '../fetch';

test('fetchImage', (done): void => {
    expect.assertions(1);

    // const imgUrl = 'https://blah.me/cover/2294/cover.jpg';
    const imgUrl = 'https://pic2.zhimg.com/v2-56936833dd31ca0d7d504c4438e221f6_b.jpg';
    const tmpDir = createTempFolder();
    console.log(tmpDir);

    fetchImage(imgUrl, tmpDir, 'test.jpg')
        .then(({remoteImgSize, localImgSize}): void => {
            expect(remoteImgSize).toBe(localImgSize);
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
            expect(err.attempts).toBe(3);
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

test('fetchStream', (done): void => {
    jest.setTimeout(20000);
    expect.assertions(2);

    let remoteImgSize: number;
    let localImgSize: number;

    const tmpDir = createTempFolder();
    // const imgUrl = 'https://blah.me/cover/2294/cover.jpg';
    const imgUrl = 'https://pic2.zhimg.com/v2-56936833dd31ca0d7d504c4438e221f6_b.jpg';
    const imgFile = path.join(tmpDir, 'test.jpg');
    const imgStream = fs.createWriteStream(imgFile);
    imgStream.on('close', (): void => {
        console.log('close img stream');
        expect(fs.existsSync(imgFile)).toBeTruthy();

        fs.stat(imgFile, (err, stats): void => {
            localImgSize = stats.size;
            console.log('localImgSize', localImgSize);
            expect(localImgSize).toBe(remoteImgSize);

            // 删除临时文件夹
            fse.removeSync(tmpDir);

            done();
        });
    });

    fetchStream(imgUrl)
        .then((resp): void => {
            resp.request.on('complete', (res): void => {
                const contentLength = res.headers['content-length'];
                if (contentLength) {
                    remoteImgSize = parseInt(contentLength, 10);
                }
                console.log('remoteImgSize', remoteImgSize);
            });

            resp.pipe(imgStream);
            console.log('complete');
            // done();
        })
        .catch((err): void => {
            console.log('ERR', err);
            done();
        });
});

test('fetchStream: retry 3 times for not exist remote image', (done): void => {
    jest.setTimeout(15000);
    expect.assertions(1);

    fetchStream('https://site-not-exist.com/not-exist.jpg').catch((err): void => {
        expect(err.attempts).toBe(3);
        done();
    });
});

test('fetchStream: not retry for 404 page', (done): void => {
    jest.setTimeout(15000);
    expect.assertions(1);

    fetchStream('https://github.com/request/request123').catch((err): void => {
        console.log(err);
        expect(err.message).toContain('404');
        done();
    });
});
