# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.10.0](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/compare/@someok/comic-spider@1.9.0...@someok/comic-spider@1.10.0) (2021-05-08)

### Bug Fixes

-   修正 18comic 使其忽略不合规的网址 ([79c8064](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/79c80647897c0754cc486e35720df02a6e7a8006))
-   修正 18comic 抓取 bug ([da047e7](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/da047e70dbf85a9cfc67168514ad3f223420ad37))
-   修正 mn5 抓取地址 ([00afe98](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/00afe98d644867f6675c82b884882335d0b6f551))

### Features

-   优化字符串中括号解析，支持中括号、小括号，并支持不完整匹配的括号 ([012b820](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/012b82016ac87e6350833f23a31bcad3398aeeba))
-   优化更新命令 ([8fc605d](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/8fc605de60afcdc0ea4e603225627f3efa39d45c))
-   使用新的文件名解析 ([0fe555a](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/0fe555a1d2856afb8ad73bc307c4746ab9e942ff))
-   升级所有依赖组件到最新版，并修正因升级出错的代码 ([4874875](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/487487507aebd662309d1fefc47e8a78f26b1857))
-   升级所有组件到最新版 ([29be72a](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/29be72a210e96925557bb3e8d1dacfd2d511ce47))
-   增加 comic-spider-update 用来批量更新部分支持的网站 ([614d16c](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/614d16c5390c0bc820010d6a796383f0d7e06d50))
-   文件名增加 Windows 非法字符过滤 ([3ce6549](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/3ce65497fe4b82e4c036f6439eda8133314d9ab3))
-   根据 eslint 提示去除无效代码 ([8d555b6](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/8d555b6f69cdf347590a801a702e6faab463b160))

# [1.9.0](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/compare/@someok/comic-spider@1.8.1...@someok/comic-spider@1.9.0) (2020-10-26)

### Bug Fixes

-   修正 @someok/comic-spider 导入方法 ([39f8596](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/39f8596))
-   修正一些语法错误 ([9f3aaa5](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/9f3aaa5))
-   删除无用的 export ([92e38ae](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/92e38ae))

### Features

-   将 spiders 删除，mn5 抓取部分转移到 comic-spider 中 ([53a0875](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/53a0875))

## [1.8.2](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/compare/@someok/comic-spider@1.8.1...@someok/comic-spider@1.8.2) (2020-10-26)

### Bug Fixes

-   修正 @someok/comic-spider 导入方法 ([39f8596](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/39f8596))
-   修正一些语法错误 ([9f3aaa5](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/9f3aaa5))
-   删除无用的 export ([92e38ae](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/92e38ae))

### Features

-   将 spiders 删除，mn5 抓取部分转移到 comic-spider 中 ([53a0875](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/53a0875))

## [1.8.1](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/compare/@someok/comic-spider@1.8.0...@someok/comic-spider@1.8.1) (2020-10-24)

### Bug Fixes

-   将 comic spider 中部分方法 export 出去 ([b75458b](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/b75458b))

# [1.8.0](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/compare/@someok/comic-spider@1.7.0...@someok/comic-spider@1.8.0) (2020-10-24)

### Features

-   优化图片文件命名，支持过滤掉图片 url 后的多余参数 ([e7c012c](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/e7c012c))
-   升级所有依赖组件 ([614cc08](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/614cc08))
-   去掉抓取时多余的输出 ([4c753e5](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/4c753e5))
-   增加 18comic 网站抓取 ([03ec96e](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/03ec96e))
-   增加标题按照中括号分隔方法 ([9cdca9d](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/9cdca9d))
-   **comic-spider:** 优化抓取功能的重试处理 ([3349004](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/3349004))

# [1.7.0](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/compare/@someok/comic-spider@1.6.0...@someok/comic-spider@1.7.0) (2020-06-10)

### Bug Fixes

-   去除无用调用 ([3c4f604](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/3c4f604))

### Features

-   增加一个新的漫画站点 ([4805e37](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/4805e37))
-   将读取目录页和图片列表的方法转移为通用功能 ([1732c91](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/1732c91))

# [1.6.0](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/compare/@someok/comic-spider@1.5.1...@someok/comic-spider@1.6.0) (2020-06-10)

### Features

-   下载图片时增加 timeout 默认超时时间 ([9513d10](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/9513d10))

## [1.5.1](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/compare/@someok/comic-spider@1.5.0...@someok/comic-spider@1.5.1) (2020-06-10)

**Note:** Version bump only for package @someok/comic-spider

# [1.5.0](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/compare/@someok/comic-spider@1.4.0...@someok/comic-spider@1.5.0) (2020-05-08)

### Features

-   comic spider 选择站点后会将选择项缓存到配置中，以便下次使用方便 ([fae84c6](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/fae84c6))
-   转移 env 配置文件到 .comic-spider 下 ([6bbc10f](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/6bbc10f))

# [1.4.0](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/compare/@someok/comic-spider@1.3.0...@someok/comic-spider@1.4.0) (2020-05-08)

### Bug Fixes

-   修复测试代码中的 agent 类型 ([add9af2](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/add9af2))

### Features

-   删除 request 依赖 ([3b9ee9e](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/3b9ee9e))
-   升级依赖组件并修正 eslint 与单元测试错误 ([69d9df8](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/69d9df8))

# [1.3.0](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/compare/@someok/comic-spider@1.2.0...@someok/comic-spider@1.3.0) (2020-05-07)

### Features

-   重构 http 请求为 got ([eab4d3b](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/eab4d3b))

# [1.2.0](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/compare/@someok/comic-spider@1.1.0...@someok/comic-spider@1.2.0) (2020-04-23)

### Features

-   修正新版 177 页面读取方法 ([a473f5b](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/a473f5b))

# [1.1.0](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/compare/@someok/comic-spider@1.0.6...@someok/comic-spider@1.1.0) (2020-04-23)

### Bug Fixes

-   修正 comic-spider 中 inquirer 的依赖错误 ([5bf6fa9](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/5bf6fa9))

### Features

-   修复 177pic 图片抓取地址 ([d05511b](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/commit/d05511b))

## [1.0.6](https://github.com/someok/node-toolkit/tree/master/packages/comic-spider/compare/@someok/comic-spider@1.0.5...@someok/comic-spider@1.0.6) (2019-07-18)

**Note:** Version bump only for package @someok/comic-spider

## [1.0.5](https://github.com/someok/node-toolkit/compare/@someok/comic-spider@1.0.4...@someok/comic-spider@1.0.5) (2019-07-18)

**Note:** Version bump only for package @someok/comic-spider
