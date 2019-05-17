import path from 'path';

import {travelTocNodes} from '../generate';

import {loadToc} from '../toc';

test('travel toc nodes', () => {
    const tocDir = path.resolve(__dirname, 'epub', 'toc1');
    const result = loadToc(tocDir);
    const tocNodes = result.data;
    // console.log(tocNodes);
    travelTocNodes(null, tocNodes);
});
