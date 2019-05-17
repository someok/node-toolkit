import fs from 'fs';
import path from 'path';
import {PathMode, existPath, createTempFolder, readUtf8OrGbkReadFile} from '../fileUtils';

test('existPath', () => {
    let stat = existPath('~/abcdefg');
    expect(stat).toEqual(PathMode.NOT_EXIST);

    stat = existPath(__dirname);
    expect(stat).toEqual(PathMode.IS_DIRECTORY);

    stat = existPath(path.join(__dirname, 'txt-files/encoding/gb18030.txt'));
    expect(stat).toEqual(PathMode.IS_FILE);
});

test('createTempFolder', () => {
    const tmp = createTempFolder();
    expect(existPath(tmp)).toBe(PathMode.IS_DIRECTORY);

    const name = path.basename(tmp);
    expect(name.startsWith('t2e-')).toBeTruthy();

    // 删除临时文件夹
    expect(() => {
        fs.rmdirSync(tmp);
    }).not.toThrow();
});

function encFile(name: string) {
    return path.join(__dirname, 'txt-files/encoding', name);
}

test('readUtf8OrGbkReadFile', () => {
    let txt = readUtf8OrGbkReadFile(encFile('utf8.txt'), false);
    expect(txt.trim()).toBe('中文');

    txt = readUtf8OrGbkReadFile(encFile('big5.txt'), false);
    // console.log(txt);
    // expect(txt.trim()).toBe('中文');
    expect(txt).toContain('安保處');

    txt = readUtf8OrGbkReadFile(encFile('gbk.txt'), false);
    expect(txt.trim()).toBe('中文');

    txt = readUtf8OrGbkReadFile(encFile('gb18030.txt'));
    expect(txt.trim()).toBe('中文');
});
