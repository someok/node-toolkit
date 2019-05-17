import path from 'path';
import {genEpub} from '../index';

test('gen epub', () => {
    const txtDir = path.resolve(__dirname, 'epub/toc1');
    genEpub(txtDir, '/Users/wjx/Desktop/demo/test.epub');
});
