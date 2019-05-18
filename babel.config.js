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

// const plugins = [];

module.exports = {presets};
