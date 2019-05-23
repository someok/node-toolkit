import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import {createTempFolder} from '@someok/node-utils/lib/fileUtils';

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

// afterEach(() => {
// });

test('generate', () => {
    const tmpDir = createTempFolder();
    // console.log(tmpDir);
    const result = loadToc(path.resolve(__dirname, 'epub', 'toc1'));
    generate(tmpDir, meta, result.data);

    expect(fs.existsSync(path.join(tmpDir, 'mimetype'))).toBeTruthy();
    expect(fs.existsSync(path.join(tmpDir, 'META-INF/container.xml'))).toBeTruthy();
    expect(fs.existsSync(path.join(tmpDir, 'OPS/package.opf'))).toBeTruthy();
    expect(fs.existsSync(path.join(tmpDir, 'OPS/book/chapter-0000.xhtml'))).toBeFalsy();
    expect(fs.existsSync(path.join(tmpDir, 'OPS/book/chapter-0001.xhtml'))).toBeTruthy();
    expect(fs.existsSync(path.join(tmpDir, 'OPS/book/chapter-0009.xhtml'))).toBeTruthy();
    expect(fs.existsSync(path.join(tmpDir, 'OPS/book/table-of-contents.ncx'))).toBeTruthy();
    expect(fs.existsSync(path.join(tmpDir, 'OPS/book/table-of-contents.xhtml'))).toBeTruthy();

    fse.removeSync(tmpDir);
});
