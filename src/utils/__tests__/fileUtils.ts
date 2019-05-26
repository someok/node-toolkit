import path from 'path';
import {readUtf8OrGbkReadFile} from '../fileUtils';

function encFile(name: string): string {
    return path.join(__dirname, 'txt-files/encoding', name);
}

test('readUtf8OrGbkReadFile', (): void => {
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
