# txt2epub

将 txt 文本转换为 epub 的命令行小工具，`TypeScript` 实现。

功能概述：

- 将单个 txt 按章节分隔为多个 txt
- 将 txt 所在文件夹作为 epub 目录，并生成 epub
- 支持对多个 txt 操作

## 安装方式

```
npm install @someok/txt2epub -g
```

### 使用方式

```bash
txt2epub [option] [command]
```

命令调用方式类似 `git xxx`。

```
Usage: txt2epub [options] [command]

转换指定文件夹下的 txt 为 epub 格式

Options:
  -v, --version        output the version number
  -h, --help           output usage information

Commands:
  init|i [dir]         交互式命令，初始化 yaml 格式的 metadata 文件, [dir] 未提供时采用当前目录
  split|s [options]    按章节分隔单个 txt 文件到目标路径下
  convert|c [options]  转换 txt 所在目录为 epub 格式

```
