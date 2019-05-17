const path = require('path');
const fs = require('fs');
const klawSync = require('klaw-sync');
const fse = require('fs-extra');
const archiver = require('archiver');

function genEpubFile(folder, zipFile) {
    const paths = klawSync(folder);

    const output = fs.createWriteStream(zipFile);
    const archive = archiver('zip', {
        zlib: {level: 9}, // Sets the compression level.
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', function() {
        console.log('Data has been drained');
    });

    archive.on('progress', function(progress) {
        console.log(progress);
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning
            console.log(err);
        } else {
            // throw error
            throw err;
        }
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err) {
        // throw err;
        console.log(err);
    });

    // pipe archive data to the file
    archive.pipe(output);

    const prefix = folder.endsWith('/') ? folder : folder + '/';
    paths.forEach(({path: itemPath, stats}) => {
        // console.log(itemPath);
        // const stat = item.stats;
        const isDir = stats.isDirectory();
        const isFile = stats.isFile();
        let title = itemPath.replace(prefix, '');
        if (isDir && !title.endsWith('/')) {
            title += '/';
        }
        // console.log(title, isDir, isFile);
        if (isDir) {
            archive.directory(title);
        }
        if (isFile) {
            archive.append(fs.createReadStream(itemPath), {name: title});
        }
    });

    archive.append('中文朱镕基', {name: 'file2.txt'});

    archive.finalize();
}

module.exports = {
    genEpubFile,
};
