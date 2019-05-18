import path from 'path';

import {toHtmlOrderList, toNavMap} from '../TxtNodeListConvert';
import {loadToc} from '../../epub/toc';

test('toNavMap', () => {
    const tocDir = path.resolve(__dirname, 'toc1');
    const result = loadToc(tocDir);
    const tocNodes = result.data;
    // console.log(tocNodes);
    const str = toNavMap(tocNodes);
    // console.log(str);
    expect(str).toMatchSnapshot();
});

test('toHtmlOrderList', () => {
    const tocDir = path.resolve(__dirname, 'toc1');
    const result = loadToc(tocDir);
    const tocNodes = result.data;
    // console.log(tocNodes);
    const str = toHtmlOrderList(tocNodes);
    // console.log(str);
    expect(str).toMatchSnapshot();
});
