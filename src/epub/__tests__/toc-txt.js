const path = require('path');

const {loadAllTxtFileNames} = require('../toc');

test('loadAllTxtFileNames', () => {
    let names = loadAllTxtFileNames(path.join(__dirname, './txt-files/demo1'));
    expect(names[0]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '1',
            title: '1',
        })
    );
    expect(names[1]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '2',
            title: '2',
        })
    );
    expect(names[2]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '3',
            title: '3',
        })
    );

    names = loadAllTxtFileNames(path.join(__dirname, './txt-files/demo2'), true);
    console.log(names);
    expect(names[0]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '123',
            title: '123',
        })
    );
    expect(names[1]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: 'abcd',
            title: 'abcd',
        })
    );
    expect(names[2]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '李四',
            title: '李四',
        })
    );
    expect(names[3]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '中文标题',
            title: '中文标题',
        })
    );

    names = loadAllTxtFileNames(path.join(__dirname, './txt-files/demo3'), true);
    console.log(names);
    expect(names[0]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '01__中文标题',
            title: '中文标题',
        })
    );
    expect(names[1]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '02__李四',
            title: '李四',
        })
    );
    expect(names[2]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '03__abcd',
            title: 'abcd',
        })
    );
    expect(names[3]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '03__ab_cd_中文',
            title: 'ab_cd_中文',
        })
    );
    expect(names[4]).toEqual(
        expect.objectContaining({
            ext: '.txt',
            rawTitle: '123',
            title: '123',
        })
    );
});
