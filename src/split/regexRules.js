module.exports = {
    zhChapter: {
        title: '中文章节',
        description: '第 x 章、第 x 节 xxx',
        re: /^\s*(第.+[章节].*)\s*$/gm,
    },
    num: {
        title: '数字',
        description: '1, 2 xxx, 3...',
        re: /^\s*(\d+.*)\s*$/gm,
    },
    zhNum: {
        title: '中文数字',
        description: '一、二 xxx、三...',
        re: /^\s*([一二三四五六七八九十百]+.*)\s*$/gm,
    },
};
