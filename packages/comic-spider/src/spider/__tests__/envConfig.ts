import path from 'path';
import {existDataDir, readEnv} from '../envConfig';

test('readEnv', (): void => {
    const envPath = path.resolve(__dirname, 'env', '.env');
    const env = readEnv(envPath);

    expect(env).not.toBeUndefined();

    if (env) {
        expect(env.TEST1).toBe('test1');
        expect(env.TEST2).toBe('test2');
    }

    expect(process.env.TEST1).toBe('test1');
    expect(process.env.TEST2).toBe('test2');
});

test('.env not exist', (): void => {
    const envPath = path.resolve(__dirname, 'env', '.env-not-exist');

    expect(readEnv(envPath)).toBeNull();
});

test('.env has not COMIC_SPIDER_DATA_DIR', (): void => {
    const envPath = path.resolve(__dirname, 'env', '.env-no-COMIC_SPIDER_DATA_DIR');

    expect((): void => {
        readEnv(envPath);
    }).toThrowError('COMIC_SPIDER_DATA_DIR 属性不存在');
});

test('existDataDir', (): void => {
    process.env.COMIC_SPIDER_DATA_DIR = __dirname;
    const exist = existDataDir();
    expect(exist).toBeTruthy();

    process.env.COMIC_SPIDER_DATA_DIR = '/path/not/exist';
    expect(existDataDir()).toBeFalsy();

    delete process.env.COMIC_SPIDER_DATA_DIR;
    expect((): void => {
        existDataDir();
    }).toThrowError('[COMIC_SPIDER_DATA_DIR] 属性未定义');
});
