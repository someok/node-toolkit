const path = require('path');
const fse = require('fs-extra');
const {createTempFolder, existDir, existFile} = require('../../utils/fileUtils');
const {travelTocNodes} = require('../generate');
const {loadToc} = require('../toc');

test('travel toc nodes', () => {
    const tocDir = path.resolve(__dirname, 'epub', 'toc1');
    const result = loadToc(tocDir);
    const tocNodes = result.data;
    // console.log(tocNodes);
    travelTocNodes(null, tocNodes);
});
