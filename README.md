# node-tookit

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
