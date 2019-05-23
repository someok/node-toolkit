import fse from 'fs-extra';
import path from 'path';
import {genTxtDir2Epub} from '../index';
import {createTempFolder} from '@someok/node-utils/lib/fileUtils';

test('genTxtDir2Epub', async () => {
    const tmpDir = createTempFolder();
    // console.log(tmpDir);

    const txtDir = path.resolve(__dirname, 'epub/toc1');
    let meta = await genTxtDir2Epub(txtDir, tmpDir);
    // 生成的 epub 使用默认名字
    let epubFile = path.join(tmpDir, meta.epubTitle());
    expect(fse.existsSync(epubFile)).toBeTruthy();

    // 使用指定的文件名
    const name = 'test.epub';
    epubFile = path.join(tmpDir, name);
    await genTxtDir2Epub(txtDir, epubFile);
    expect(fse.existsSync(epubFile)).toBeTruthy();

    fse.removeSync(tmpDir);
});
