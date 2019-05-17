import path from 'path';

import {createTempFolder} from '../../utils/fileUtils';
import {generate} from '../generate';
import Meta from '../../metadata/Meta';
import TxtNode from '../../utils/TxtNode';
import {loadToc} from '../toc';

let meta: Meta;
let nodes: TxtNode[];
beforeEach(() => {
    meta = new Meta('TITLE', 'AUTHOR', 'DESCRIPTION');

    nodes = [];
    for (let i = 0; i < 3; i++) {
        const node = new TxtNode('1', undefined, undefined, '1.txt', '.ext');
        nodes.push(node);
    }
});

afterEach(() => {
});

test('generate', () => {
    const tmpDir = createTempFolder();
    console.log(tmpDir);
    const result = loadToc(path.resolve(__dirname, 'epub', 'toc1'));
    generate(tmpDir, meta, result.data);
});
