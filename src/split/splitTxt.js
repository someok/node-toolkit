const _ = require('lodash');
const regexRules = require('./regexRules');
const Chapter = require('./Chapter');

const MAX_TITLE_LENGTH = 20;

function splitByRegexRule(txt, ruleKey = 'zhChapter', maxTitleLength = MAX_TITLE_LENGTH) {
    if (!txt || typeof txt !== 'string') throw new Error('txt 参数必须为字符串, 且内容不能为空');

    const content = txt.trim();
    if (!content) throw new Error('文本内容不能为空');

    const rule = regexRules[ruleKey];
    if (!rule) throw new Error(`给定正则规则 ${ruleKey} 不存在`);

    const regex = rule.re;

    let m;
    let isFirst = true;
    const chapters = [];

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
            const title = m[1];
            if (title.length > maxTitleLength) continue;

            const fromPos = pos + title.length + 1;

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

module.exports = splitByRegexRule;
