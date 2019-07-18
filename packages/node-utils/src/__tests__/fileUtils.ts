import fs from 'fs';
import path from 'path';
import {createTempFolder, existDir, existFile, existPath, fileName, PathMode} from '../fileUtils';

test('existPath', (): void => {
    let stat = existPath('~/abcdefg');
    expect(stat).toEqual(PathMode.NOT_EXIST);

    stat = existPath(__dirname);
    expect(stat).toEqual(PathMode.IS_DIRECTORY);

    stat = existPath(path.join(__dirname, 'txt-files/readonly.txt'));
    expect(stat).toEqual(PathMode.NOT_WRITE);

    stat = existPath(path.join(__dirname, 'txt-files/encoding/gb18030.txt'));
    expect(stat).toEqual(PathMode.IS_FILE);
});

test('exist dir or file', (): void => {
    let exist = existDir(__dirname);
    expect(exist).toBeTruthy();
    exist = existFile(path.join(__dirname, 'txt-files/encoding/gb18030.txt'));
    expect(exist).toBeTruthy();
    exist = existFile(path.join(__dirname, 'txt-files/readonly.txt'));
    expect(exist).toBeFalsy();
});

test('fileName', (): void => {
    let name = 'a/b/c.txt';
    expect(fileName(name, true)).toBe('c.txt');
    expect(fileName(name)).toBe('c');
});

test('createTempFolder', (): void => {
    const tmp = createTempFolder('t2e-');
    expect(existPath(tmp)).toBe(PathMode.IS_DIRECTORY);

    const name = path.basename(tmp);
    expect(name.startsWith('t2e-')).toBeTruthy();

    // 删除临时文件夹
    expect((): void => {
        fs.rmdirSync(tmp);
    }).not.toThrow();
});
