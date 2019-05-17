import path from 'path';
import {loadToc} from '../toc';

test('load one level md toc', () => {
    const folder = path.resolve(__dirname, 'epub', 'demo1');
    const result = loadToc(folder);
    // console.log(result);
    const {data} = result;
    expect(data.length).toBe(3);
    expect(data[0]).toEqual(
        expect.objectContaining({
            title: '1',
            rawTitle: '1.txt',
            ext: '.txt',
            path: path.resolve(folder, '1.txt'),
        })
    );
    expect(data[2]).toEqual(
        expect.objectContaining({
            title: '3',
            rawTitle: '3.txt',
            ext: '.txt',
            path: path.resolve(folder, '3.txt'),
        })
    );
});

test('load one level txt toc', () => {
    const folder = path.resolve(__dirname, 'epub', 'demo2');
    const result = loadToc(folder);
    // console.log(result);
    const {data} = result;
    expect(data.length).toBe(3);
    expect(data[0]).toEqual(
        expect.objectContaining({
            title: '2',
            rawTitle: '001__2.txt',
            ext: '.txt',
            path: path.resolve(folder, '001__2.txt'),
        })
    );
    expect(data[1]).toEqual(
        expect.objectContaining({
            title: '1',
            rawTitle: '1.txt',
            ext: '.txt',
            path: path.resolve(folder, '1.txt'),
        })
    );
    expect(data[2]).toEqual(
        expect.objectContaining({
            title: '3',
            rawTitle: '3.txt',
            ext: '.txt',
            path: path.resolve(folder, '3.txt'),
        })
    );
});

test('load two level md toc', () => {
    const folder = path.resolve(__dirname, 'epub', 'demo3');
    const result = loadToc(folder);

    const {data, success} = result;
    console.log(data);

    expect(success).toBeTruthy();
    expect(data.length).toBe(2);
    expect(data[0]).toEqual(
        expect.objectContaining({
            title: 'f1',
            rawTitle: 'f1',
            ext: '',
            path: undefined,
        })
    );
    expect(data[1].children[1]).toEqual(
        expect.objectContaining({
            title: '2',
            rawTitle: 'f2/2.txt',
            ext: '.txt',
            path: path.resolve(folder, 'f2/2.txt'),
        })
    );
});

test('not exist txt', () => {
    const folder = path.resolve(__dirname, 'epub', 'demo4');
    const result = loadToc(folder);
    // console.log(result);
    expect(result.success).toBeFalsy();
    expect(result.message).toBe('未发现任何文本文件');
});

test('toc.md empty', () => {
    const folder = path.resolve(__dirname, 'epub', 'demo5');
    const result = loadToc(folder);
    // console.log(result);
    expect(result.success).toBeFalsy();
    expect(result.message).toBe('[toc.md] 文件内容尚未定义');
});
