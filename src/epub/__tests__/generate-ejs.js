const path = require('path');
const fse = require('fs-extra');
const {createTempFolder, existDir, existFile} = require('../../utils/fileUtils');
const {generate} = require('../generate');
const Meta = require('../../metadata/Meta');
const TxtNode = require('../../utils/TxtNode');
const {loadToc} = require('../toc');

let meta;
let nodes;
beforeEach(() => {
    meta = new Meta('TITLE', 'AUTHOR', 'DESCRIPTION');

    nodes = [];
    for (let i = 0; i < 3; i++) {
        const node = new TxtNode('1', null, null, '1.txt', '.ext', null);
        nodes.push(node);
    }
});

afterEach(() => {});

test('generate', () => {
    const tmpDir = createTempFolder();
    console.log(tmpDir);
    const result = loadToc(path.resolve(__dirname, 'epub', 'toc1'));
    generate(tmpDir, meta, result.data);
});
