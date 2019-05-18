import path from 'path';
import fs from 'fs';
import fse from 'fs-extra';
import klawSync from 'klaw-sync';
import archiver from 'archiver';
import yauzl from 'yauzl';

/**
 * 将给定文件夹压缩成 zip 文件。
 *
 * @param folder 待压缩的文件夹
 * @param zipFile zip 文件
 * @return {Promise}
 */
export function zipDir(folder: string, zipFile: string): Promise<archiver.Archiver> {
    return new Promise(function(resolve, reject) {
        // 目录不存在则创建
        fse.ensureDirSync(path.dirname(zipFile));

        const paths = klawSync(folder);

        const output = fs.createWriteStream(zipFile);
        const archive = archiver('zip', {
            zlib: {level: 9}, // Sets the compression level.
        });

        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function() {
            // console.log(archive.pointer() + ' total bytes');
            // console.log('archiver has been finalized and the output file descriptor has closed.');

            resolve(archive);
        });

        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on('end', function() {
            console.log('Data has been drained');
        });

        // archive.on('progress', function(progress) {
        //     console.log(progress);
        // });

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                // log warning
                console.log(err);
            } else {
                // throw error
                // throw err;
                reject(err);
            }
        });

        // good practice to catch this error explicitly
        archive.on('error', function(err) {
            // console.log(err);
            // throw err;
            reject(err);
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
                archive.directory(title, false);
            }
            if (isFile) {
                archive.append(fs.createReadStream(itemPath), {name: title});
            }
        });

        archive.finalize();
    });
}

/**
 * 解压缩 zip 到指定文件夹。
 *
 * @param zipFile zip 文件路径
 * @param toDir 解压目标路径
 * @return {Promise}
 */
export function unzip(zipFile: string, toDir: string): Promise<undefined> {
    return new Promise(function(resolve, reject) {
        yauzl.open(zipFile, {lazyEntries: true}, function(err, zipfile) {
            if (err) throw err;
            // console.log(zipFile);

            if (!zipfile) return;

            zipfile.readEntry();
            zipfile.on('entry', function(entry) {
                // console.log(entry);
                // console.log(entry.fileName);

                if (/\/$/.test(entry.fileName)) {
                    fse.ensureDirSync(path.join(toDir, entry.fileName));
                    zipfile.readEntry();
                } else {
                    const filePath = path.join(toDir, entry.fileName);
                    // console.log('file', path.dirname(filePath));
                    fse.ensureDirSync(path.dirname(filePath));

                    zipfile.openReadStream(entry, function(err, readStream) {
                        if (err) throw err;

                        if (!readStream) return;

                        const writeStream = fs.createWriteStream(filePath);
                        // writeStream.on('close', function() {
                        //     console.log('close');
                        // });

                        readStream.pipe(writeStream);
                        zipfile.readEntry();
                    });
                }
            });

            zipfile.on('close', function() {
                resolve();
            });
            zipfile.on('error', function(err) {
                reject(err);
            });
        });
    });
}
