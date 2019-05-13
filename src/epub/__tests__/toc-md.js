const path = require('path');

const {loadMdContentAsToc} = require('../toc');

test('load simple md toc', () => {
    const folder = path.resolve(__dirname, 'md-files', 'demo1');
    const toc = path.resolve(folder, 'toc.md');
    let result = loadMdContentAsToc(folder, toc);
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

test('load level md toc', () => {
    const folder = path.resolve(__dirname, 'md-files', 'demo2');
    const toc = path.resolve(folder, 'toc.md');
    let result = loadMdContentAsToc(folder, toc);
    // console.log(result);
    expect(result.success).toBeTruthy();

    const {data} = result;
    expect(data.length).toBe(2);
    expect(data[0]).toEqual(
        expect.objectContaining({
            title: 'f1',
            rawTitle: 'f1',
            ext: '',
            path: path.resolve(folder, 'f1'),
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

test('load level not exist md toc', () => {
    const folder = path.resolve(__dirname, 'md-files', 'demo2');
    const toc = path.resolve(folder, 'toc-not-exist.md');
    let result = loadMdContentAsToc(folder, toc);
    // console.log(result);
    expect(result.success).toBeFalsy();
    expect(result.message).toContain('not-exist');
});
