import PImage from 'pureimage';

import {createCoverImage, registerFont, wrapText} from '../coverImgUtils';
import Meta from '../../metadata/Meta';

test('wrapText', done => {
    registerFont().load(function() {
        const img = PImage.make(200, 200);
        const ctx = img.getContext('2d');
        const txt = '这是一个很长的测试文本，this is long test text';
        const lines = wrapText(ctx, txt, 0, 0, 100);
        console.log(lines);
        expect(lines.length).toBe(3);
        expect(lines[0].line).toBe('这是一个很长的测');
        expect(lines[0].x).toBe(0);
        expect(lines[0].y).toBe(0);

        done();
    });
});

test.skip('initCover', done => {
    for (let i = 0; i < 5; i++) {
        createCoverImage(
            `/Users/wjx/Desktop/demo/test${i}.jpg`,
            new Meta(
                '这是一个很长的测试文本，this is long test text',
                '测试员测试员测试员测试员测试员测试员'
            ),
            'center'
        )
            .then(() => {
                console.log('over');
                done();
            })
            .catch(err => {
                console.log(err);
                done();
            });
    }
});
