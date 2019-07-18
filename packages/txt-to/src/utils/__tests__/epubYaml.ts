import path from 'path';
import {readClosestEpubYaml} from '../epubYaml';

test('read closest epub yaml', (): void => {
    let from = path.join(__dirname, 'closest/dir0/dir01/dir011');
    let result = readClosestEpubYaml(from);
    // console.log(result);
    expect(result.success).toBeTruthy();
    expect(result.data.saveTo).toBe('/opt');

    from = path.join(__dirname, 'closest/dir1');
    result = readClosestEpubYaml(from);
    // console.log(result);
    expect(result.success).toBeFalsy();
    expect(result.message).toBe('[__epub.yml] 不存在');

    from = path.join(__dirname, 'closest/dir2');
    result = readClosestEpubYaml(from);
    // console.log(result);
    expect(result.success).toBeFalsy();
    expect(result.message).toContain('未定义正确的 [saveTo] 属性');
});
