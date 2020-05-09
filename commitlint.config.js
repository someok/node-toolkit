module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // git commit 主题不区分大小写
        'subject-case': [0],
    },
};
