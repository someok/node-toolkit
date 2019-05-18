import path from 'path';
import fse from 'fs-extra';

import {createTempFolder, existDir, existFile} from '../fileUtils';
import {zipDir, unzip} from '../zipUtils';

test('zipDir and unzip', async () => {
    const tmpDir = createTempFolder();
    // console.log(tmpDir);
    const epubDir = path.resolve(__dirname, 'epub');
    const epubFile = path.join(tmpDir, 'test.epub');

    await zipDir(epubDir, epubFile);
    expect(existFile(epubFile)).toBeTruthy();

    const extractDir = path.join(tmpDir, 'epub');
    await unzip(epubFile, extractDir);
    expect(existDir(extractDir)).toBeTruthy();

    fse.removeSync(tmpDir);
});
