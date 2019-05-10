//
// Babel 7 配置
// 用于 jest
//

const presets = [
    [
        '@babel/preset-env',
        {
            // targets 配置参见 .browserslistrc
            useBuiltIns: 'usage',
            modules: false,
        },
    ],

    '@babel/preset-react',
];

const plugins = [
    '@babel/plugin-proposal-class-properties',
    // '@babel/plugin-syntax-dynamic-import',
    // '@babel/plugin-transform-runtime',
    // 'lodash',
];

module.exports = {plugins};
