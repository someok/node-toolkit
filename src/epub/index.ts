import {logError} from '../utils/logUtils';
import {createTempFolder} from '../utils/fileUtils';
import {genEpubFile} from '../utils/zipUtils';

import {generate} from './generate';
import {readMetadata} from './epubMeta';

export function genEpub(txtDir: string, epubFile: string) {
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

