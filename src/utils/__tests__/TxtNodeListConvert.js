const path = require('path');
const {toNavMap, toHtmlOrderList} = require('../TxtNodeListConvert');
const {loadToc} = require('../../epub/toc');

test('toNavMap', () => {
    const tocDir = path.resolve(__dirname, 'toc1');
    const result = loadToc(tocDir);
    const tocNodes = result.data;
    // console.log(tocNodes);
    const str = toNavMap(tocNodes);
    console.log(str);
});

test('toHtmlOrderList', () => {
    const tocDir = path.resolve(__dirname, 'toc1');
    const result = loadToc(tocDir);
    const tocNodes = result.data;
    // console.log(tocNodes);
    const str = toHtmlOrderList(tocNodes);
    console.log(str);
});
