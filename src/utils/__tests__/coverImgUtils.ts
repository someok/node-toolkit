import {initCover, init} from '../coverImgUtils';
import Meta from '../../metadata/Meta';

test('initCover', done => {
    initCover(new Meta('测试', 'wjx'))
        .then(() => {
            console.log('over');
            done();
        })
        .catch(err => {
            console.log(err);
            done();
        });
});
