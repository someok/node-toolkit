import path from 'path';

import {readMetadata} from '../epubMeta';
import Meta from '../../metadata/Meta';

function demoFolder(name: string): string {
    return path.resolve(__dirname, 'epub', name);
}

test('readMetadata', (done): void => {
    readMetadata(demoFolder('demo1'))
        .then(
            ({meta, tocNodes}): void => {
                expect(tocNodes.length).toBe(3);
                // console.log(meta);
                // console.log(typeof meta);
                // console.log(meta instanceof Meta);
                expect(meta).toBeInstanceOf(Meta);
                expect(meta.toJson()).toEqual({
                    title: 'demo1',
                    titleSuffix: '',
                    author: 'wjx',
                    description: '',
                    cover: 'cover.jpg',
                    autoCover: true,
                    uuid: meta.uuid,
                    version: '1.0.0',
                });
            }
        )
        .finally(
            (): void => {
                done();
            }
        );
});
