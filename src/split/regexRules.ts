interface RuleItem {
    title: string;
    description: string;
    re: RegExp;
}

export type RuleItemKey = 'zhChapter' | 'num' | 'zhNum';

/**
 * 章节检测正则。
 *
 * 除了前置内容（如数字或第 x 章）之外，长度限制在 30 个字符。
 *
 * 由于章节很多人划分的随心所欲，很难全部匹配，所以这儿仅仅实现这么几种，如果不符合要求，还需要先手工修改下文档。
 */
const rules: Map<RuleItemKey, RuleItem> = new Map<RuleItemKey, RuleItem>([
    [
        'zhChapter',
        {
            title: '中文章节',
            description: '第 x 章、第 x 节 xxx',
            re: /^\s*([第笫].{1,6}[章节卷集部篇回].{0,30})\s*$/gm,
        },
    ],
    [
        'num',
        {
            title: '数字',
            description: '1, 2 xxx, 3...',
            re: /^\s*(\d{1,6}.{0,30})\s*$/gm,
        },
    ],
    [
        'zhNum',
        {
            title: '中文数字',
            description: '一、二 xxx、三...',
            re: /^\s*([一二三四五六七八九十百千]{1,6}.{0,30})\s*$/gm,
        },
    ],
]);

export default rules;
