interface BracketString {
    isBracket: boolean;
    text: string;
}

/**
 * 按照中括号分隔给定文本。括号格式支持[]和().
 *
 * 对于部分不完备的括号，例如只有左括号或右括号的，则匹配为文本。
 *
 * 例如：[aaa][bbb]ccc[ddd][eee][fff(ggg)hhh)iii]
 * 分隔后的结果为：
 * [ { isBracket: true, text: '[aaa]' },
 *  { isBracket: true, text: '[bbb]' },
 *  { isBracket: false, text: 'ccc' },
 *  { isBracket: true, text: '[ddd]' },
 *  { isBracket: true, text: '[eee]' },
 *  { isBracket: false, text: '[fff' },
 *  { isBracket: true, text: '(ggg)' },
 *  { isBracket: false, text: 'hhh' },
 *  { isBracket: false, text: ')' },
 *  { isBracket: false, text: 'iii' },
 *  { isBracket: false, text: ']' } ]
 *
 * @param str
 */
export function splitByBracket(str: string): BracketString[] {
    if (!str.trim()) return [];

    // eslint-disable-next-line prettier/prettier
    const txt = str.replace('【', '[')
        .replace('】', ']')
        .replace('（', '(')
        .replace('）', ')');

    // 使用正则表达式按照中括号分隔字符串
    // 例如 [aaa][bbb]ccc[ddd][eee] 将会分隔为：
    // ["[", "aaa", "]", "[", "bbb", "]", "ccc", "[", "ddd", "]", "[", "eee", "]"]
    const arr = txt
        .split(/([\[\]()])/)
        .filter(s => !!s.trim())
        .map(s => s.trim());

    let bracketStart = false;
    let bracketItem = '';
    const len = arr.length;
    const newArr: BracketString[] = [];
    for (let i = 0; i < len; i++) {
        const item = arr[i];
        if (item === '[' || item === '(') {
            if (bracketItem) {
                newArr.push({isBracket: false, text: bracketItem});
            }
            bracketStart = true;
            bracketItem = item;
            continue;
        }
        if (item === ']' || item === ')') {
            bracketItem += item;
            if (bracketStart) {
                bracketStart = false;
                newArr.push({isBracket: true, text: bracketItem});
            } else {
                newArr.push({isBracket: false, text: bracketItem});
            }
            bracketItem = '';
            continue;
        }

        if (bracketStart) {
            bracketItem += item;
            if (i === len - 1) {
                newArr.push({isBracket: false, text: bracketItem});
            }
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
