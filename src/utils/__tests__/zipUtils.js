const path = require('path');
const {genEpubFile} = require('../zipUtils');

test('genEpubFile', () => {
    const epubDir = path.resolve(__dirname, 'epub');
    const epubFile = '/Users/wjx/Desktop/demo/zip-test.epub';

    genEpubFile(epubDir, epubFile);
});
