import path from 'path';

import {readMetadata} from '../epubMeta';
import Meta from '../../metadata/Meta';

function demoFolder(name: string) {
    return path.resolve(__dirname, 'epub', name);
}

test('readMetadata', () => {
    const result = readMetadata(demoFolder('demo1'));
    // console.log(result);
    const {meta, tocNodes} = result.data;
    expect(result.success).toBeTruthy();
    expect(tocNodes.length).toBe(3);
    // console.log(meta);
    // console.log(typeof meta);
    // console.log(meta instanceof Meta);
    expect(meta).toBeInstanceOf(Meta);
    expect(meta.toJson()).toEqual({
        title: 'demo1',
        author: 'wjx',
        description: '',
        uuid: meta.uuid,
        version: '1.0.0',
    });
});
