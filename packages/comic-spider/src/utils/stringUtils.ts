interface BracketString {
    isBracket: boolean;
    text: string;
}

/**
 * 按照中括号分隔给定文本。
 * 例如：[aaa][bbb]ccc[ddd][eee]
 * 分隔后的结果为：
 *    [ { isBracket: true, text: '[aaa]' },
 *      { isBracket: true, text: '[bbb]' },
 *      { isBracket: false, text: 'ccc' },
 *      { isBracket: true, text: '[ddd]' },
 *      { isBracket: true, text: '[eee]' } ]
 * @param str
 */
export function splitByBracket(str: string): BracketString[] {
    if (!str.trim()) return [];

    const txt = str.replace('【', '[').replace('】', ']');

    // 使用正则表达式按照中括号分隔字符串
    // 例如 [aaa][bbb]ccc[ddd][eee] 将会分隔为：
    // ["[", "aaa", "]", "[", "bbb", "]", "ccc", "[", "ddd", "]", "[", "eee", "]"]
    const arr = txt
        .split(/([\[\]])/)
        .filter(s => !!s.trim())
        .map(s => s.trim());

    let bracketStart = false;
    let bracketItem = '';
    const len = arr.length;
    const newArr: BracketString[] = [];
    for (let i = 0; i < len; i++) {
        const item = arr[i];
        if (item === '[') {
            bracketStart = true;
            bracketItem = item;
            continue;
        }
        if (item === ']') {
            bracketStart = false;
            bracketItem += item;
            newArr.push({isBracket: true, text: bracketItem});

            continue;
        }

        if (bracketStart) {
            bracketItem += item;
        } else {
            newArr.push({isBracket: false, text: item});
        }
    }

    return newArr;
}

/**
 * 去除文件名中 Windows 不支持的字符。
 *
 * @param filename 文件名
 */
export function escapeWindowsFilename(filename: string): string {
    if (!filename) return '';

    return filename.replace(/[\\\/:*?"<>|!]/g, '');
}
