const rAmp = /&/g;
const rLt = /</g;
const rApos = /'/g;
const rQuot = /"/g;
const hChars = /[&<>"']/;

/**
 * 将不符合 HTML 规范的字符替换掉。
 *
 * @param str 字符串
 */
export default function htmlEscape(str?: string) {
    if (!str) {
        return '';
    }

    if (hChars.test(String(str))) {
        return str
            .replace(rAmp, '&amp;')
            .replace(rLt, '&lt;')
            .replace(rApos, '&apos;')
            .replace(rQuot, '&quot;');
    } else {
        return str;
    }
}
