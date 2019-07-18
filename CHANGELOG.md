# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.0](https://github.com/someok/txt-to/compare/v1.2.1...v1.3.0) (2019-07-18)

### Bug Fixes

-   修正 inquirer.Questions 定义 ([a94e6f2](https://github.com/someok/txt-to/commit/a94e6f2))

### Features

-   meta 中增加标题后缀 ([0cf3aa9](https://github.com/someok/txt-to/commit/0cf3aa9)), closes [#11](https://github.com/someok/txt-to/issues/11)
-   从封面模板目录随机读取一张用于生成封面 ([3a0a79e](https://github.com/someok/txt-to/commit/3a0a79e))
-   优化 \_\_epub.yml 不存在或配置不正确时候的提示信息 ([b1671fd](https://github.com/someok/txt-to/commit/b1671fd))
-   使用更漂亮的图片替换 01 ([2c7451d](https://github.com/someok/txt-to/commit/2c7451d))
-   增加 \_\_epub.yml 配置用于在各个 txt 目录自定义 epub 输出路径 ([9b6404a](https://github.com/someok/txt-to/commit/9b6404a)), closes [#7](https://github.com/someok/txt-to/issues/7)
-   增加 3 张新的封面模板 ([18129cf](https://github.com/someok/txt-to/commit/18129cf))
-   增加一张新的封面模板图 ([653d211](https://github.com/someok/txt-to/commit/653d211))
-   调整文件分隔规则顺序 ([abde93f](https://github.com/someok/txt-to/commit/abde93f))

### refactor

-   采用 yarn workspaces 重构整个项目结构 ([4118f77](https://github.com/someok/txt-to/commit/4118f77))

### Tests

-   启用 jest 的 coverage ([b2a3d0f](https://github.com/someok/txt-to/commit/b2a3d0f))

### BREAKING CHANGES

-   引入 node-utils 作为子 package

### [1.2.1](https://github.com/someok/txt-to/compare/v1.2.0...v1.2.1) (2019-05-25)

### Features

-   meta 信息中增加 autoCover 属性 ([917d503](https://github.com/someok/txt-to/commit/917d503))
-   package.opf meta 中开启 cover 项 ([bb9f547](https://github.com/someok/txt-to/commit/bb9f547))

## [1.2.0](https://github.com/someok/txt-to/compare/v1.1.4...v1.2.0) (2019-05-23)

### Features

-   使用 pureimage 实现图片上写字，不过此功能尚属于测试阶段 ([ea6f521](https://github.com/someok/txt-to/commit/ea6f521))
-   初始化 meta 时支持自动生成封面图片 ([65b5e4a](https://github.com/someok/txt-to/commit/65b5e4a)), closes [#4](https://github.com/someok/txt-to/issues/4) [#6](https://github.com/someok/txt-to/issues/6)
-   加入字体和背景图资源 ([a631a8b](https://github.com/someok/txt-to/commit/a631a8b))

### [1.1.4](https://github.com/someok/txt-to/compare/v1.1.3...v1.1.4) (2019-05-23)

### [1.1.3](https://github.com/someok/txt-to/compare/v1.1.2...v1.1.3) (2019-05-23)

### Bug Fixes

-   unzip 方法中部分异常未正常 reject 出去 ([15d4d74](https://github.com/someok/txt-to/commit/15d4d74))

### [1.1.2](https://github.com/someok/txt-to/compare/v1.1.1...v1.1.2) (2019-05-21)

### Features

-   优化章节标题读取方式 ([91134f3](https://github.com/someok/txt-to/commit/91134f3))
-   批量生成 epub 的时候将目录层级限定为 1 层 ([b286f09](https://github.com/someok/txt-to/commit/b286f09))
-   父节点单纯作为标题的时候指向最近的子节点地址 ([dc6f300](https://github.com/someok/txt-to/commit/dc6f300))

### [1.1.1](https://github.com/someok/txt-to/compare/v1.1.0...v1.1.1) (2019-05-21)

### Features

-   标题、内容增加 HTML escape 处理 ([7aa9f45](https://github.com/someok/txt-to/commit/7aa9f45)), closes [#1](https://github.com/someok/txt-to/issues/1) [#2](https://github.com/someok/txt-to/issues/2)

## [1.1.0](https://github.com/someok/txt-to/compare/v1.0.0...v1.1.0) (2019-05-18)

### Features

-   txt 内容转为 html 时才有 p 来分隔行 ([940dfca](https://github.com/someok/txt-to/commit/940dfca))
-   txt 读取时增加 big5 转换 ([3e7b432](https://github.com/someok/txt-to/commit/3e7b432))
-   优化批量 txt 文件夹转换为 epub 时候的顺序 ([fb32715](https://github.com/someok/txt-to/commit/fb32715))
-   使用 marked 解析 md 格式的目录 ([5532e3b](https://github.com/someok/txt-to/commit/5532e3b))
-   基本实现 epub 生成功能 ([da7a847](https://github.com/someok/txt-to/commit/da7a847))
-   基本实现 epub 生成功能，并可正确生成 zip 格式的 epub ([b47c422](https://github.com/someok/txt-to/commit/b47c422))
-   增加 epub meta 读取功能 ([052837c](https://github.com/someok/txt-to/commit/052837c))
-   增加 log 输出方法 ([d7e6719](https://github.com/someok/txt-to/commit/d7e6719))
-   增加 txt 分隔工具 ([7eef2c7](https://github.com/someok/txt-to/commit/7eef2c7))
-   增加命令行处理 ([0e35dc3](https://github.com/someok/txt-to/commit/0e35dc3))
-   完善命令行工具，增加 split 命令 ([a4e551e](https://github.com/someok/txt-to/commit/a4e551e))
-   完成 toc、metadata 等基础信息的读取 ([7c0b3ed](https://github.com/someok/txt-to/commit/7c0b3ed))
-   完成 txt 分隔功能 ([8c4ba26](https://github.com/someok/txt-to/commit/8c4ba26))
-   将 bin、main 目录指向 dist ([872b124](https://github.com/someok/txt-to/commit/872b124))
-   目录文件名改为 toc.md ([59b4236](https://github.com/someok/txt-to/commit/59b4236))

### Tests

-   md 测试文件增加说明 ([4af766e](https://github.com/someok/txt-to/commit/4af766e))
-   增加 toc.md 测试文件 ([91bb4ac](https://github.com/someok/txt-to/commit/91bb4ac))
-   测试提交 git 时是否影响 tab ([a8b6d5a](https://github.com/someok/txt-to/commit/a8b6d5a))
-   测试提交 git 时是否影响 tab ([eb3b95a](https://github.com/someok/txt-to/commit/eb3b95a))
-   测试提交 git 时是否影响 tab ([ab387fa](https://github.com/someok/txt-to/commit/ab387fa))
-   测试提交 git 时是否影响 tab ([ef844d7](https://github.com/someok/txt-to/commit/ef844d7))
-   测试提交 git 时是否影响 tab ([f7c8e4b](https://github.com/someok/txt-to/commit/f7c8e4b))

## 1.0.0 (2019-05-08)

### Features

-   初始化项目 ([ab62463](https://github.com/someok/txt-to/commit/ab62463))
-   增加命令行提示配置 ([4710435](https://github.com/someok/txt-to/commit/4710435))
