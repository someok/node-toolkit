const path = require('path');

const {loadTxtNamesAsToc} = require('../toc');

test('loadTxtNamesAsToc', () => {
    let result = loadTxtNamesAsToc(path.join(__dirname, './txt-files/demo1'));
    let names = result.data;
    // console.log(names);
    expect(names[0]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '1.txt',
            title: '1',
        })
    );
    expect(names[1]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '2.txt',
            title: '2',
        })
    );
    expect(names[2]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '3.txt',
            title: '3',
        })
    );

    result = loadTxtNamesAsToc(path.join(__dirname, './txt-files/demo2'), true);
    names = result.data;
    // console.log(names);
    expect(names[0]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '123.txt',
            title: '123',
        })
    );
    expect(names[1]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: 'abcd.txt',
            title: 'abcd',
        })
    );
    expect(names[2]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '李四.txt',
            title: '李四',
        })
    );
    expect(names[3]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '中文标题.txt',
            title: '中文标题',
        })
    );

    result = loadTxtNamesAsToc(path.join(__dirname, './txt-files/demo3'), true);
    names = result.data;
    // console.log(names);
    expect(names[0]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '01__中文标题.txt',
            title: '中文标题',
        })
    );
    expect(names[1]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '02__李四.txt',
            title: '李四',
        })
    );
    expect(names[2]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '03__abcd.txt',
            title: 'abcd',
        })
    );
    expect(names[3]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '03__ab_cd_中文.txt',
            title: 'ab_cd_中文',
        })
    );
    expect(names[4]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '123.txt',
            title: '123',
        })
    );
});
