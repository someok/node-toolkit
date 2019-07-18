import _ from 'lodash';

import regexRules, {RuleItemKey} from './regexRules';
import Chapter from './Chapter';

/**
 * 有时候标题内容会有一些不规范的字符或括号，这个方法去掉它们。
 *
 * @param title 标题
 * @return {string} 规范化后的标题
 */
function checkTitle(title: string): string {
    let t = title.trim();

    if (t.endsWith('.') || t.endsWith('。')) t = t.substring(0, t.length - 1);
    if (t.startsWith('(') && t.endsWith(')')) t = t.substring(1, t.length - 1);
    if (t.startsWith('（') && t.endsWith('）')) t = t.substring(1, t.length - 1);

    return t;
}

/**
 * 按照预定义的正则规则分隔文本内容到 {@link Chapter} 数组中。
 *
 * @param txt 文本内容
 * @param ruleKey 分隔规则，参见 {@link regexRules}
 * @param maxTitleLength 标题最大长度，超过则忽略，小于等于 0 表示本方法不控制，只靠正则限制
 * @return {Array} 分隔后的 {@link Chapter} 数组
 */
export function splitByRegexRule(
    txt: string,
    ruleKey: RuleItemKey,
    maxTitleLength: number = 0
): Chapter[] {
    if (!txt) throw new Error('txt 参数必须为字符串, 且内容不能为空');

    const content = txt.trim();
    if (!content) throw new Error('文本内容不能为空');

    const rule = regexRules.get(ruleKey);
    if (!rule) throw new Error(`给定正则规则 ${ruleKey} 不存在`);

    const regex = rule.re;

    let m;
    let isFirst = true;
    const chapters: Chapter[] = [];

    while ((m = regex.exec(content)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // 表示初始章节之前还有内容
        if (m.index !== 0 && isFirst) {
            const firstChapter = new Chapter('前言', 0);
            chapters.push(firstChapter);
        }

        if (m) {
            const pos = m.index;
            const title = checkTitle(m[0]);
            if (maxTitleLength > 0 && title.length > maxTitleLength) continue;

            // m[1] 是去除前后不可见元素之后的纯文本
            // m[0] 则是包含了这些不可见元素，用于计数才更准确
            const fromPos = pos + m[0].length + 1;

            // 如果存在上一章节，则将其目标位置置为当前章节之前
            if (!_.isEmpty(chapters)) {
                const preChapter = chapters[chapters.length - 1];
                preChapter.toPos = pos;
            }
            const chapter = new Chapter(title, fromPos);
            chapters.push(chapter);
        }
        isFirst = false;
    }

    // 设置最后一个章节的终止位置
    if (!_.isEmpty(chapters)) {
        const lastChapter = chapters[chapters.length - 1];
        lastChapter.toPos = content.length;
    }

    chapters.forEach((chapter): void => {
        chapter.content = content.substring(chapter.fromPos, chapter.toPos).trim();
    });

    return chapters;
}

/**
 * 按照预定规则自动分隔文本，规则定义于 {@link regexRules}.
 *
 * @param txt 文本内容
 * @param maxTitleLength 标题最大长度，超过则忽略，小于等于 0 表示本方法不控制，只靠正则限制
 */
export function splitAuto(txt: string, maxTitleLength: number = 0): Chapter[] {
    for (let [key, rule] of regexRules) {
        const {re} = rule;
        const match = txt.match(re);
        if (!match) continue;

        return splitByRegexRule(txt, key, maxTitleLength);
    }

    throw new Error('txt 中内容不适合当前预定义的分隔规则');
}
