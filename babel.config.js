//
// Babel 7 配置
// 用于 jest
//

const presets = [
    [
        '@babel/preset-env',
        {
            targets: {
                node: 'current',
            },
        },
    ],
    '@babel/preset-typescript',
];

const plugins = [
    // todo: 删除此依赖
    '@babel/plugin-proposal-class-properties',
    // '@babel/plugin-syntax-dynamic-import',
    // '@babel/plugin-transform-runtime',
    // 'lodash',
];

module.exports = {presets};
