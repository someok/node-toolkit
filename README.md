# node-tookit

[![yarn](https://img.shields.io/badge/maintained%20with-yarn-1476a2.svg?style=flat-square)](https://yarnpkg.com/)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg?style=flat-square)](https://lerna.js.org/)
[![GitHub](https://img.shields.io/github/license/someok/node-toolkit.svg?style=flat-square)](https://github.com/someok/node-toolkit/blob/master/LICENSE)

[![Travis Status](https://img.shields.io/travis/someok/node-toolkit.svg?style=flat-square)](https://travis-ci.org/someok/node-toolkit)
[![Codecov](https://img.shields.io/codecov/c/github/someok/node-toolkit.svg?style=flat-square&token=49b1c58e2ff6485595b4e1fcd7d9dbc9)](https://codecov.io/gh/someok/node-toolkit)

[![GitHub repo size](https://img.shields.io/github/repo-size/someok/node-toolkit.svg?style=flat-square)](https://github.com/someok/node-toolkit)
[![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/someok/node-toolkit.svg?style=flat-square)](https://github.com/someok/node-toolkit)
[![GitHub issues](https://img.shields.io/github/issues-raw/someok/node-toolkit.svg?style=flat-square)](https://github.com/someok/node-toolkit/issues)

个人常用工具集，通过 `yarn workspaces` 和 `lerna` 的配合使用实现的多项目管控模式。

## 分工

### yarn

`yarn` 用于管理 `root` 和 `packages` 下的依赖：

在 root 下添加新组件示例：

> yarn add -W -D @commitlint/prompt-cli

在 workspace 下添加新组件示例：

> yarn workspace @someok/node-utils add -D xxx

### lerna

`lerna` 用于编译、测试、变更版本号和发布到 npm

-   build: yarn run build
-   test: yarn run test
-   version: yarn run version
-   publish: yarn run publish

注意：上述命令不能忽略 `run`，否则会调用 `yarn`自身的 build 或 version

## packages

-   node-utils: 基础的工具集，其它 package 需要依赖此子项目
-   txt-to: 文本转换为 epub
-   comic-spider: 漫画抓取

## 发布流程

1. `yarn run build`: 编译 `TypeScript` 为 `JavaScript`
1. `yarn run version`: 变更各子项目版本号
1. `yarn run publish`: 发布到 `npmjs.org`，并在 git 上打上相应标签

`lerna` 在执行 `version` 和 `publish` 操作的时候会分析子项目的依赖关系，如果某个项目上的更新不影响其它项目，
则只会处理已更新项目，否则会连带处理虽然未更新，但是对已更新项目有依赖的其它项目。
