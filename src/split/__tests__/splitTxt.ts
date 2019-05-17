import fs from 'fs';
import path from 'path';

import {splitAuto, splitByRegexRule} from '../splitTxt';

function loadTxt(fileName: string): string {
    const buf = fs.readFileSync(path.resolve(__dirname, 'txt', fileName));
    return buf.toString();
}

test('split zh chapter txt', () => {
    let txt = loadTxt('zhChapter.txt');

    let result = splitByRegexRule(txt, 'zhChapter');
    console.log(result);
    expect(result.length).toBe(4);
    expect(result[0].title).toBe('前言');
    expect(result[1].title.startsWith('第一章')).toBeTruthy();
    expect(result[3].content.includes('第四章')).toBeTruthy();

    txt = loadTxt('zhChapter1.txt');
    result = splitByRegexRule(txt, 'zhChapter');
    console.log(result);
    expect(result.length).toBe(3);
    expect(result[0].title.startsWith('第一章')).toBeTruthy();
});

test('split num chapter txt', () => {
    let txt = loadTxt('num.txt');

    let result = splitByRegexRule(txt, 'num');
    console.log(result);
    expect(result.length).toBe(4);
    expect(result[0].title).toBe('前言');
    expect(result[1].title).toBe('1 test1');
    expect(result[3].content.includes('4 ')).toBeTruthy();
});

test('split zh num chapter txt', () => {
    let txt = loadTxt('zhnum.txt');

    let result = splitByRegexRule(txt, 'zhNum');
    console.log(result);
    expect(result.length).toBe(4);
    expect(result[0].title).toBe('前言');
    expect(result[1].title).toBe('一 test1');
    expect(result[3].content.includes('四 ')).toBeTruthy();
});

test('split auto', () => {
    let txt = loadTxt('noChapter.txt');

    expect(() => {
        splitAuto(txt);
    }).toThrowError('txt 中内容不适合当前预定义的分隔规则');

    txt = loadTxt('zhChapter.txt');
    let result = splitAuto(txt);
    console.log(result);
    expect(result.length).toBe(4);
    expect(result[0].title).toBe('前言');
    expect(result[1].title.startsWith('第一章')).toBeTruthy();
    expect(result[3].content.includes('第四章')).toBeTruthy();

    txt = loadTxt('num.txt');
    result = splitAuto(txt);
    console.log(result);
    expect(result.length).toBe(4);
    expect(result[0].title).toBe('前言');
    expect(result[1].title).toBe('1 test1');
    expect(result[3].content.includes('4 ')).toBeTruthy();

    txt = loadTxt('zhnum.txt');
    result = splitAuto(txt);
    console.log(result);
    expect(result.length).toBe(4);
    expect(result[0].title).toBe('前言');
    expect(result[1].title).toBe('一 test1');
    expect(result[3].content.includes('四 ')).toBeTruthy();
});
