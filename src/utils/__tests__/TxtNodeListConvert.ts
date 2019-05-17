import path from 'path';

import {toHtmlOrderList, toNavMap} from '../TxtNodeListConvert';
import {loadToc} from '../../epub/toc';

// todo: 增加 expect 校验
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
