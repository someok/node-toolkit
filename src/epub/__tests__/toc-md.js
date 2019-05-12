const path = require('path');

const {loadToc} = require('../toc');

function loadMd(name) {
    return path.resolve(__dirname, 'epub-files', name);
}

test('load md toc', () => {
    let nodes = loadToc(loadMd('demo1'));
    console.log(nodes);
});
