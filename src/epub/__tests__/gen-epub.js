const path = require('path');
const genEpub = require('../index');

test('gen epub', () => {
    const txtDir = path.resolve(__dirname, 'epub/toc1');
    genEpub(txtDir, '/Users/wjx/Desktop/demo/test.epub');
});
