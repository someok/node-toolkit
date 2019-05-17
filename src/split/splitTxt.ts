import _ from 'lodash';

import regexRules, {RuleItems} from './regexRules';
import Chapter from './Chapter';

const MAX_TITLE_LENGTH = 30;

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

type RuleKeyType = keyof RuleItems;

/**
 * 按照预定义的正则规则分隔文本内容到 {@link Chapter} 数组中。
 *
 * @param txt 文本内容
 * @param ruleKey 分隔规则，参见 {@link regexRules}
 * @param maxTitleLength 标题最大长度，超过则忽略，默认是 20
 * @return {Array} 分隔后的 {@link Chapter} 数组
 */
export function splitByRegexRule(
    txt: string,
    ruleKey: RuleKeyType = 'zhChapter',
    maxTitleLength: number = MAX_TITLE_LENGTH
): Chapter[] {
    if (!txt) throw new Error('txt 参数必须为字符串, 且内容不能为空');

    const content = txt.trim();
    if (!content) throw new Error('文本内容不能为空');

    const rule = regexRules[ruleKey];
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
            if (title.length > maxTitleLength) continue;

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

    chapters.forEach(chapter => {
        chapter.content = content.substring(chapter.fromPos, chapter.toPos).trim();
    });

    return chapters;
}

export function splitAuto(txt: string, maxTitleLength: number = MAX_TITLE_LENGTH): Chapter[] {
    const ruleKeys = Object.keys(regexRules);

    for (let i = 0; i < ruleKeys.length; i++) {
        const ruleKey = ruleKeys[i];
        const re = regexRules[ruleKey].re;
        const match = txt.match(re);
        if (!match) continue;

        return splitByRegexRule(txt, ruleKey, maxTitleLength);
    }

    throw new Error('txt 中内容不适合当前预定义的分隔规则');
}
