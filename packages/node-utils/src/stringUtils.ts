/**
 * 截去字符串中间部分。
 *
 * @param fullStr 源字符串
 * @param strLen 目标长度
 * @param separator 分隔
 */
export function truncateMiddle(fullStr: string, strLen = 50, separator = '...'): string {
    if (!fullStr) return fullStr;
    if (fullStr.length <= strLen) return fullStr;

    const sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2);

    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
}
