module.exports = {
    linters: {
        '*.{js,jsx}': ['prettier-eslint --write', 'git add'],
        '*.{md,html,json}': ['prettier-eslint --write', 'git add'],
        '*.{css,scss,less}': ['prettier-eslint --write', 'git add'],
    },

    ignore: ['**/*/tab-space-mix.md'],
};
