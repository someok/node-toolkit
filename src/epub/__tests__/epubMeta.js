const path = require('path');
const {readMetadata} = require('../epubMeta');
const Meta = require('../../metadata/Meta');

function demoFolder(name) {
    return path.resolve(__dirname, 'epub-files', name);
}

test('readMetadata', () => {
    const result = readMetadata(demoFolder('demo1'));
    const {meta, tocNodes} = result.data;
    expect(result.success).toBeTruthy();
    expect(tocNodes.length).toBe(3);
    console.log(meta);
    console.log(typeof meta);
    console.log(meta instanceof Meta);
    expect(meta).toBeInstanceOf(Meta);
    expect(meta.toJson()).toEqual({
        title: 'demo1',
        author: 'wjx',
        description: '',
        uuid: meta.uuid,
        version: '1.0.0',
    });
});
