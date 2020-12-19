import {splitByBracket, escapeWindowsFilename} from './stringUtils';

const IGNORE_BRACKET = [
    '汉化',
    '漢化',
    '掃圖',
    '製作',
    '出品',
    '翻訳',
    '日语',
    '中文',
    '4K',
    'DL',
    'CHINESE',
];

export function parseTitle(title: string): string {
    const arr = splitByBracket(title).filter(item => {
        const {isBracket, text} = item;
        if (!isBracket) return true;

        let isUse = true;
        const upText = text.toUpperCase();
        for (let i = 0; i < IGNORE_BRACKET.length; i++) {
            const ignorebracketElement = IGNORE_BRACKET[i];
            if (upText.includes(ignorebracketElement)) {
                isUse = false;
                break;
            }
        }
        return isUse;
    });

    let ret = '';
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (item.isBracket) {
            ret += item.text;
        } else {
            ret += ' ' + item.text + ' ';
        }
    }

    // Windows 文件名长度限制
    ret = ret.trim().substr(0, 255);

    return escapeWindowsFilename(ret);
}
