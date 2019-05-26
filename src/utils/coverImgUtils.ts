import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import PImage from 'pureimage';
import {logError, logInfo} from '@someok/node-utils/lib/logUtils';
import Meta from '../metadata/Meta';

const FONT_FAMILY = 'T2ECoverFont';
const COVER_ROOT = path.resolve(__dirname, '../../epub-boilerplate/cover');
const FONT_PATH = path.join(COVER_ROOT, 'font/方正小标宋_GBK.ttf');

interface MeasureText {
    width: number;
    emHeightAscent: number;
    emHeightDescent: number;
}

interface PImageContext {
    fillStyle?: string;
    font?: string;
    fillText: (arg0: string, arg1: number, arg2: number) => void;
    measureText: (arg0: string) => MeasureText;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    drawImage: (txtImg: any, number: number, number2: number) => void;
}

interface PImageProps {
    width: number;
    height: number;
    getContext: (arg: string) => PImageContext;
}

export function registerFont(): {load: (callback: Function) => void} {
    return PImage.registerFont(FONT_PATH, FONT_FAMILY);
}

interface WrapTextLine {
    line: string;
    x: number;
    y: number;
}

/**
 * 按照给定宽度分隔文本。
 *
 * 当然，这种分隔方式不够严谨，例如英文单词可能从中间截断。
 *
 * @param context canvas context
 * @param text 文本内容
 * @param x 坐标 x
 * @param y 坐标 y
 * @param maxWidth 最大宽度
 * @param lineHeight 行高，默认是 measureText 中的  emHeightAscent
 */
export function wrapText(
    context: PImageContext,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight?: number
): WrapTextLine[] {
    const textMetrics = context.measureText(text);
    let testHeight = lineHeight || textMetrics.emHeightAscent;

    // 字符分隔为数组
    const txtArrs = text.split('');
    const lines: WrapTextLine[] = [];
    let line = '';
    let testY = y;

    for (let i = 0; i < txtArrs.length; i++) {
        const letter = txtArrs[i];
        let testLine = line + letter;
        const metrics: MeasureText = context.measureText(testLine);
        const {width} = metrics;
        if (i > 0 && width >= maxWidth) {
            lines.push({
                line,
                x,
                y: testY,
            });
            line = letter;
            testY += testHeight;
        } else {
            line = testLine;
        }
    }

    lines.push({
        line,
        x,
        y: testY,
    });

    return lines;
}

/**
 * 计算文字居中时候 x 轴位置。
 *
 * @param ctx context
 * @param text 文字
 * @param imgWidth 图片宽度
 */
function centerX(ctx: PImageContext, text: string, imgWidth: number): number {
    const {width} = ctx.measureText(text);
    return (imgWidth - width) / 2;
}

type TextAlign = 'left' | 'center';

/**
 * 在给定背景图上写上标题和作者。
 *
 * @param toImage 输出封面图片位置
 * @param meta {@link Meta} 信息，用于提供书名和作者
 * @param align 支持左对齐（默认）或居中
 */
export function createCoverImage(
    toImage: string,
    meta: Meta,
    align: TextAlign = 'center'
): Promise<void> {
    const font = PImage.registerFont(FONT_PATH, FONT_FAMILY);

    return new Promise<void>(function(resolve, reject): void {
        font.load(function(): void {
            const coverImgNum = _.random(1, 5);
            const coverImg = path.join(COVER_ROOT, `image/0${coverImgNum}.jpg`);
            PImage.decodeJPEGFromStream(fs.createReadStream(coverImg))
                .then(
                    (bgImg: PImageProps): void => {
                        const {width} = bgImg;
                        const ctx: PImageContext = bgImg.getContext('2d');

                        ctx.fillStyle = '#ffffff';
                        ctx.font = `100pt '${FONT_FAMILY}'`;
                        const lines = wrapText(ctx, meta.title, 100, 300, 600, 148);

                        lines.forEach(
                            (data): void => {
                                const {line, x, y} = data;
                                let xPos = x;
                                if (align === 'center') {
                                    xPos = centerX(ctx, line, width);
                                }
                                ctx.fillText(line, xPos, y);
                            }
                        );

                        if (meta.author) {
                            ctx.font = `48pt '${FONT_FAMILY}'`;

                            // 如果作者名称太长，则最多输出 2 行
                            const authorLines = wrapText(ctx, meta.author, 100, 1000, 600, 68);
                            authorLines.slice(0, 2).forEach(
                                (data): void => {
                                    const {line, x, y} = data;

                                    let xPos = x;
                                    if (align === 'center') {
                                        xPos = centerX(ctx, line, width);
                                    }
                                    ctx.fillText(line, xPos, y);
                                }
                            );
                        }

                        PImage.encodeJPEGToStream(bgImg, fs.createWriteStream(toImage))
                            .then(
                                (): void => {
                                    logInfo(`生成图片：[${toImage}]`);
                                    resolve();
                                }
                            )
                            .catch(
                                (err: Error): void => {
                                    logError(`生成图片过程中出现错误: ${err.message}`);
                                    reject(err);
                                }
                            );
                    }
                )
                .catch(
                    (err: Error): void => {
                        logError(`读取图片过程中出现错误: ${err.message}`);
                        reject(err);
                    }
                );
        });
    });
}
