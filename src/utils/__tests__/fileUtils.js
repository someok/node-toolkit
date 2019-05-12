const path = require('path');
const fs = require('fs');
const fileUtils = require('../fileUtils');

const FileMode = fileUtils.FolderMode;

test('existFolder', () => {
    let stat = fileUtils.existFolder('~/abcdefg');
    expect(stat).toEqual(FileMode.NOT_EXIST);

    stat = fileUtils.existFolder(__dirname);
    expect(stat).toEqual(FileMode.NORMAL);
});

test('file mode can not change', () => {
    FileMode.NORMAL = 123;
    expect(FileMode.NORMAL).toBe(200);
});

test('createTempFolder', () => {
    const tmp = fileUtils.createTempFolder();
    expect(fileUtils.existFolder(tmp)).toBe(fileUtils.FolderMode.NORMAL);

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
