import path from 'path';
import {checkEncodeing, closestFile, readAsUtf8String} from '../fileUtils';

test('checkEncodeing', (): void => {
    const files = ['big5.txt', 'gb18030.txt', 'gbk.txt', 'utf8.txt', 'utf8-bom.txt', 'utf16.txt'];
    files.forEach(
        (file, index): void => {
            const filePath = path.join(__dirname, 'txt-files/encoding', file);
            const result = checkEncodeing(filePath);
            // console.log(index, file, result);
            if (index === 0) {
                expect(result.success).toBeTruthy();
                expect(result.data).toBe('Big5');
            }
            if (index === 1) {
                expect(result.success).toBeTruthy();
                expect(result.data).toBe('GB18030');
            }
            if (index === 2) {
                expect(result.success).toBeTruthy();
                expect(result.data).toBe('GB18030');
            }
            if (index === 3) {
                expect(result.success).toBeTruthy();
                expect(result.data).toBe('UTF-8');
            }
            if (index === 4) {
                expect(result.success).toBeTruthy();
                expect(result.data).toBe('UTF-8');
            }
            if (index === 5) {
                expect(result.success).toBeFalsy();
            }
        }
    );
});

test('readAsUtf8String', (): void => {
    function filePath(file: string): string {
        return path.join(__dirname, 'txt-files/encoding', file);
    }

    let result = readAsUtf8String(filePath('big5.txt'));
    // console.log(result);
    expect(result.success).toBeTruthy();
    expect(result.data).toContain('big5');
    expect(result.data).toContain('中文');

    result = readAsUtf8String(filePath('gb18030.txt'));
    // console.log(result);
    expect(result.success).toBeTruthy();
    expect(result.data).toContain('gb18030');
    expect(result.data).toContain('中文');

    result = readAsUtf8String(filePath('gbk.txt'));
    // console.log(result);
    expect(result.success).toBeTruthy();
    expect(result.data).toContain('gbk');
    expect(result.data).toContain('中文');

    result = readAsUtf8String(filePath('utf8.txt'));
    // console.log(result);
    expect(result.success).toBeTruthy();
    expect(result.data).toContain('utf8');
    expect(result.data).toContain('中文');

    result = readAsUtf8String(filePath('utf8-bom.txt'));
    // console.log(result);
    expect(result.success).toBeTruthy();
    expect(result.data).toContain('utf8-bom');
    expect(result.data).toContain('中文');

    result = readAsUtf8String(filePath('utf16.txt'));
    // console.log(result);
    expect(result.success).toBeFalsy();
});

test('closestFile', (): void => {
    let from = path.join(__dirname, 'closest/dir0/dir01/dir011');
    let result = closestFile(from, 'test');
    // console.log(result);
    expect(result.success).toBeTruthy();
    expect(result.data).toContain('closest/dir0/test');

    from = path.join(__dirname, 'closest/dir1');
    result = closestFile(from, 'test');
    // console.log(result);
    expect(result.success).toBeFalsy();
});
