import path from 'path';
import fs from 'fs';
import PImage from 'pureimage';
import Meta from '../metadata/Meta';

const FONT_FAMILY = 'SourceHanSerifCN-Heavy';
const COVER_ROOT = path.resolve(__dirname, '../../epub-boilerplate/cover');
// const FONT_PATH = path.join(COVER_ROOT, 'maobi.ttf');
const FONT_PATH = path.join(COVER_ROOT, 'SourceHanSansSC-Heavy.ttf');
const COVER_IMG = path.join(COVER_ROOT, '33313b.jpg');

interface PImageProps {
    width: number;
    height: number;
    getContext: Function;
}

export function init(meta: Meta) {
    var image: {
        getContext: (
            arg0: string
        ) => {
            fillStyle: string;
            font: string;
            fillText: (arg0: string, arg1: number, arg2: number) => void;
            measureText: (arg0: string) => {};
        };
    };
    var context: {
        fillStyle: string;
        font: string;
        fillText: (arg0: string, arg1: number, arg2: number) => void;
        measureText: (arg0: string) => {};
    };
    const WHITE = 0xffffffff;
    const BLACK = 0x000000ff;

    return new Promise(function(resolve, reject) {
        image = PImage.make(200, 200);
        context = image.getContext('2d');
        const font = PImage.registerFont(FONT_PATH, FONT_FAMILY);
        font.load(function() {
            context.fillStyle = 'blue';
            context.font = `48pt '${FONT_FAMILY}'`;
            context.fillText('中文some text', 50, 50);
            var metrics = context.measureText('some text');
            console.log(metrics);

            PImage.encodePNGToStream(
                image,
                fs.createWriteStream('/Users/wjx/Desktop/demo/test.png')
            )
                .then(() => {
                    console.log('wrote out the png file to out.png');
                    resolve();
                })
                .catch((err: Error) => {
                    console.log('there was an error writing');
                    reject(err);
                });
            resolve();
        });
    });
}

export function initCover(meta: Meta) {
    const font = PImage.registerFont(FONT_PATH, FONT_FAMILY);

    return new Promise(function(resolve, reject) {
        font.load(function() {
            PImage.decodeJPEGFromStream(fs.createReadStream(COVER_IMG))
                .then((bgImg: PImageProps) => {
                    console.log('size is', bgImg.width, bgImg.height);

                    const bgCtx = bgImg.getContext('2d');
                    bgCtx.fillStyle = '#003300';
                    bgCtx.globalAlpha = 1;

                    const txtImg = PImage.make(bgImg.width - 200, bgImg.height);

                    const ctx = txtImg.getContext('2d');
                    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
                    ctx.fillRect(0, 0, bgImg.width - 200, bgImg.height);

                    ctx.fillStyle = '#ffffff';
                    ctx.font = `48pt '${FONT_FAMILY}'`;
                    const txt = '王建旭王建旭';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle'; //设置文本的垂直对齐方式

                    ctx.fillText(txt, 100, 100, 600);
                    ctx.fillText(txt, 0, 80 + 100);

                    bgCtx.drawImage(txtImg, 100, 100);
                    console.log(ctx.measureText('王'));

                    PImage.encodeJPEGToStream(
                        bgImg,
                        fs.createWriteStream('/Users/wjx/Desktop/demo/test.jpg')
                    )
                        .then(() => {
                            console.log('wrote out the png file to out.png');
                            resolve(bgImg);
                        })
                        .catch((err: Error) => {
                            console.log('there was an error writing');
                            reject(err);
                        });
                })
                .catch((err: Error) => {
                    reject(err);
                });
        });
    });
}
