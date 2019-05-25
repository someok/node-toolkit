# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.1](https://github.com/someok/txt2epub/compare/v1.2.0...v1.2.1) (2019-05-25)

### Features

- meta 信息中增加 autoCover 属性 ([917d503](https://github.com/someok/txt2epub/commit/917d503))
- package.opf meta 中开启 cover 项 ([bb9f547](https://github.com/someok/txt2epub/commit/bb9f547))

## [1.2.0](https://github.com/someok/txt2epub/compare/v1.1.4...v1.2.0) (2019-05-23)

### Features

- 使用 pureimage 实现图片上写字，不过此功能尚属于测试阶段 ([ea6f521](https://github.com/someok/txt2epub/commit/ea6f521))
- 初始化 meta 时支持自动生成封面图片 ([65b5e4a](https://github.com/someok/txt2epub/commit/65b5e4a)), closes [#4](https://github.com/someok/txt2epub/issues/4) [#6](https://github.com/someok/txt2epub/issues/6)
- 加入字体和背景图资源 ([a631a8b](https://github.com/someok/txt2epub/commit/a631a8b))

### [1.1.4](https://github.com/someok/txt2epub/compare/v1.1.3...v1.1.4) (2019-05-23)

### [1.1.3](https://github.com/someok/txt2epub/compare/v1.1.2...v1.1.3) (2019-05-23)

### Bug Fixes

- unzip 方法中部分异常未正常 reject 出去 ([15d4d74](https://github.com/someok/txt2epub/commit/15d4d74))

### [1.1.2](https://github.com/someok/txt2epub/compare/v1.1.1...v1.1.2) (2019-05-21)

### Features

- 优化章节标题读取方式 ([91134f3](https://github.com/someok/txt2epub/commit/91134f3))
- 批量生成 epub 的时候将目录层级限定为 1 层 ([b286f09](https://github.com/someok/txt2epub/commit/b286f09))
- 父节点单纯作为标题的时候指向最近的子节点地址 ([dc6f300](https://github.com/someok/txt2epub/commit/dc6f300))

### [1.1.1](https://github.com/someok/txt2epub/compare/v1.1.0...v1.1.1) (2019-05-21)

### Features

- 标题、内容增加 HTML escape 处理 ([7aa9f45](https://github.com/someok/txt2epub/commit/7aa9f45)), closes [#1](https://github.com/someok/txt2epub/issues/1) [#2](https://github.com/someok/txt2epub/issues/2)

## [1.1.0](https://github.com/someok/txt2epub/compare/v1.0.0...v1.1.0) (2019-05-18)

### Features

- txt 内容转为 html 时才有 p 来分隔行 ([940dfca](https://github.com/someok/txt2epub/commit/940dfca))
- txt 读取时增加 big5 转换 ([3e7b432](https://github.com/someok/txt2epub/commit/3e7b432))
- 优化批量 txt 文件夹转换为 epub 时候的顺序 ([fb32715](https://github.com/someok/txt2epub/commit/fb32715))
- 使用 marked 解析 md 格式的目录 ([5532e3b](https://github.com/someok/txt2epub/commit/5532e3b))
- 基本实现 epub 生成功能 ([da7a847](https://github.com/someok/txt2epub/commit/da7a847))
- 基本实现 epub 生成功能，并可正确生成 zip 格式的 epub ([b47c422](https://github.com/someok/txt2epub/commit/b47c422))
- 增加 epub meta 读取功能 ([052837c](https://github.com/someok/txt2epub/commit/052837c))
- 增加 log 输出方法 ([d7e6719](https://github.com/someok/txt2epub/commit/d7e6719))
- 增加 txt 分隔工具 ([7eef2c7](https://github.com/someok/txt2epub/commit/7eef2c7))
- 增加命令行处理 ([0e35dc3](https://github.com/someok/txt2epub/commit/0e35dc3))
- 完善命令行工具，增加 split 命令 ([a4e551e](https://github.com/someok/txt2epub/commit/a4e551e))
- 完成 toc、metadata 等基础信息的读取 ([7c0b3ed](https://github.com/someok/txt2epub/commit/7c0b3ed))
- 完成 txt 分隔功能 ([8c4ba26](https://github.com/someok/txt2epub/commit/8c4ba26))
- 将 bin、main 目录指向 dist ([872b124](https://github.com/someok/txt2epub/commit/872b124))
- 目录文件名改为 toc.md ([59b4236](https://github.com/someok/txt2epub/commit/59b4236))

### Tests

- md 测试文件增加说明 ([4af766e](https://github.com/someok/txt2epub/commit/4af766e))
- 增加 toc.md 测试文件 ([91bb4ac](https://github.com/someok/txt2epub/commit/91bb4ac))
- 测试提交 git 时是否影响 tab ([a8b6d5a](https://github.com/someok/txt2epub/commit/a8b6d5a))
- 测试提交 git 时是否影响 tab ([eb3b95a](https://github.com/someok/txt2epub/commit/eb3b95a))
- 测试提交 git 时是否影响 tab ([ab387fa](https://github.com/someok/txt2epub/commit/ab387fa))
- 测试提交 git 时是否影响 tab ([ef844d7](https://github.com/someok/txt2epub/commit/ef844d7))
- 测试提交 git 时是否影响 tab ([f7c8e4b](https://github.com/someok/txt2epub/commit/f7c8e4b))

## 1.0.0 (2019-05-08)

### Features

- 初始化项目 ([ab62463](https://github.com/someok/txt2epub/commit/ab62463))
- 增加命令行提示配置 ([4710435](https://github.com/someok/txt2epub/commit/4710435))
