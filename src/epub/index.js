const {logError} = require('../utils/logUtils');
const {createTempFolder} = require('../utils/fileUtils');
const {genEpubFile} = require('../utils/zipUtils');
const {generate} = require('./generate');
const {readMetadata} = require('./epubMeta');

function genEpub(txtDir, epubFile) {
    const result = readMetadata(txtDir);
    if (!result.success) {
        logError(result.message);
        return;
    }

    const {meta, tocNodes} = result.data;

    const tmpDir = createTempFolder();
    console.log(tmpDir);
    generate(tmpDir, meta, tocNodes);

    genEpubFile(tmpDir, epubFile);
}

module.exports = genEpub;
