const path = require('path');
const fs = require('fs');
const fileUtils = require('../fileUtils');

const FileMode = fileUtils.PathMode;

test('existPath', () => {
    let stat = fileUtils.existPath('~/abcdefg');
    expect(stat).toEqual(FileMode.NOT_EXIST);

    stat = fileUtils.existPath(__dirname);
    expect(stat).toEqual(FileMode.IS_DIRECTORY);

    stat = fileUtils.existPath(path.join(__dirname, 'txt-files/encoding/gb18030.txt'));
    expect(stat).toEqual(FileMode.IS_FILE);
});

test('file mode can not change', () => {
    FileMode.IS_DIRECTORY = 123;
    expect(FileMode.IS_DIRECTORY).toBe(201);
});

test('createTempFolder', () => {
    const tmp = fileUtils.createTempFolder();
    expect(fileUtils.existPath(tmp)).toBe(fileUtils.PathMode.IS_DIRECTORY);

    const name = path.basename(tmp);
    expect(name.startsWith('t2e-')).toBeTruthy();

    // 删除临时文件夹
    expect(() => {
        fs.rmdirSync(tmp);
    }).not.toThrow();
});

function encFile(name) {
    return path.join(__dirname, 'txt-files/encoding', name);
}

test('readUtf8OrGbkReadFile', () => {
    let txt = fileUtils.readUtf8OrGbkReadFile(encFile('utf8.txt'), false);
    expect(txt.trim()).toBe('中文');

    txt = fileUtils.readUtf8OrGbkReadFile(encFile('big5.txt'), false);
    // console.log(txt);
    // expect(txt.trim()).toBe('中文');
    expect(txt).toContain('安保處');

    txt = fileUtils.readUtf8OrGbkReadFile(encFile('gbk.txt'), false);
    expect(txt.trim()).toBe('中文');

    txt = fileUtils.readUtf8OrGbkReadFile(encFile('gb18030.txt'));
    expect(txt.trim()).toBe('中文');
});
