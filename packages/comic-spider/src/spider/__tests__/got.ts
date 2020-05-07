import got, {Response} from 'got';
import tunnel from 'tunnel';
import stream from 'stream';
import {promisify} from 'util';
import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';

import {createTempFolder} from '@someok/node-utils/lib/fileUtils';

const pipeline = promisify(stream.pipeline);

test('fetch by got', (done): void => {
    got.get('https://www.anytech.cn/static-files/apk/output.json')
        .then((resp: Response<string>): void => {
            console.log(resp.statusCode);
            console.log(resp.body);
            expect(resp.statusCode).toBe(200);
            expect(resp.body).toContain('APK');
        })
        .finally((): void => {
            done();
        });
});

test('fetch by proxy', (done): void => {
    // @ts-ignore
    got('https://zh.nyahentai.com/g/269243/list2/', {
        agent: {
            http: tunnel.httpOverHttp({
                proxy: {
                    host: '127.0.0.1',
                    port: 6152,
                },
            }),
            https: tunnel.httpsOverHttp({
                proxy: {
                    host: '127.0.0.1',
                    port: 6152,
                },
            }),
        },
    })
        .then((resp: Response<string>): void => {
            console.log(resp.body);
            expect(resp.statusCode).toBe(200);
        })
        .catch((e: Error): void => {
            console.log(e);
        })
        .finally((): void => {
            done();
        });
});

test('download image', (done): void => {
    const tmp = createTempFolder('comic-');
    // console.log(tmp);

    const dest = path.resolve(tmp, 'image.jpg');

    let contentLength = 0;
    pipeline(
        got
            .stream('https://anytech.cn/image/thumb/6445eb12-c74a-4f27-b4a3-8302279e6100.jpg')
            .on('response', (response: Response): void => {
                try {
                    contentLength = parseInt(response.headers['content-length'] || '0', 10);
                } catch (e) {}
            }),
        fs.createWriteStream(dest)
    )
        .then((): void => {
            const exist = fs.existsSync(dest);
            expect(exist).toBe(true);

            const stats = fs.statSync(dest);
            expect(stats.size).toBe(contentLength);
            console.log('response', contentLength);
            fse.removeSync(tmp);
        })
        .finally((): void => {
            done();
        });
});
